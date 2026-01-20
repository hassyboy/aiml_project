import json
import os

model_path = r'c:\Users\91866\Documents\new aiml\public\models\damage_detector\model.json'

def transform_inbound_nodes(inbound_nodes):
    new_inbound_nodes = []
    
    for node in inbound_nodes:
        # Check if it's the complex Keras 3 style (dictionary)
        if isinstance(node, dict) and 'args' in node:
            args = node['args']
            
            # Helper to extract history from a single tensor dict
            def get_history(tensor_dict):
                if isinstance(tensor_dict, dict) and 'config' in tensor_dict and 'keras_history' in tensor_dict['config']:
                    return tensor_dict['config']['keras_history']
                return None

            # args[0] can be a single tensor dict or a list of tensor dicts (for Add/Concatenate)
            if len(args) > 0:
                first_arg = args[0]
                
                # Case 1: List of tensors (e.g. Add layer)
                if isinstance(first_arg, list):
                    nodes_list = []
                    for item in first_arg:
                        history = get_history(item)
                        if history:
                            nodes_list.append(history)
                    if nodes_list:
                        new_inbound_nodes.append(nodes_list)
                        
                # Case 2: Single tensor (Standard layer)
                elif isinstance(first_arg, dict):
                    history = get_history(first_arg)
                    if history:
                        # In Keras 2, a single input connection is usually [[name, idx, tensor_idx]]
                        # But sometimes for single nodes it's [name, idx, tensor_idx] inside the outer list? 
                        # TFJS usually expects array of incoming connections.
                        # For a single node, it is often: [ [name, 0, 0] ]
                        new_inbound_nodes.append([history])
        
        # Check if it's already a list (maybe partially converted or old style)
        elif isinstance(node, list):
            new_inbound_nodes.append(node)
            
    return new_inbound_nodes

try:
    with open(model_path, 'r') as f:
        data = json.load(f)
    
    print("Loaded model.json")
    
    # We assume 'modelTopology' -> 'model_config' -> 'config' -> 'layers'
    if 'modelTopology' in data and 'model_config' in data['modelTopology']:
        layers = data['modelTopology']['model_config']['config']['layers']
        
        count = 0
        for layer in layers:
            if 'inbound_nodes' in layer and layer['inbound_nodes']:
                # Print first one to verify detection
                if count == 0:
                    print("Example formatting before:", layer['inbound_nodes'][0])

                # Check if it needs fixing (is it a dict?)
                if len(layer['inbound_nodes']) > 0 and isinstance(layer['inbound_nodes'][0], dict):
                    layer['inbound_nodes'] = transform_inbound_nodes(layer['inbound_nodes'])
                    count += 1
        
        print(f"Patched inbound_nodes for {count} layers.")
        
    # Save back
    with open(model_path, 'w') as f:
        json.dump(data, f)
        
    print("Successfully patched model.json: converted Keras 3 inbound_nodes to legacy list format.")

except Exception as e:
    import traceback
    traceback.print_exc()
    print(f"Error: {e}")
