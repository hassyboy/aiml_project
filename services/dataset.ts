import { Place, PlaceCategory } from '../types';
import { PLACEHOLDER_IMAGE } from '../constants';

const CSV_DATA = `place_name,category,district,latitude,longitude,short_description,image_url,popularity_score,maintenance_score,condition_label,safety_score,crowd_level,senior_friendly,child_friendly,tags,best_visit_time,google_search_query,reviews,sentiment_score,
Mysore Palace,palace,Mysuru,12.3052,76.6552,"Historical royal residence of Wodeyars, Indo-Saracenic architecture.",https://source.unsplash.com/800x500/?Mysore%20Palace,95,82,Good,90,High,7,7,"palace,heritage,royal",Oct-Feb,Mysore Palace Karnataka,Amazing architecture|Crowded evenings|Lights are beautiful|Great for history|Must visit,0.88,
Hampi Virupaksha Temple,temple,Vijayanagara,15.335,76.4601,"UNESCO site, ancient temple from 7th century, active worship.",https://source.unsplash.com/800x500/?Hampi%20Temple,92,70,Good,85,High,6,5,"temple,UNESCO,Hampi",Oct-Feb,Hampi Virupaksha Temple,Beautiful carvings|Heat is intense|Very peaceful|Good guides|Great views,0.86,
Jog Falls,waterfall,Shivamogga,14.2298,74.7483,India's second-highest plunge waterfall.,https://source.unsplash.com/800x500/?Jog%20Falls,90,68,Moderate,75,Seasonal,6,7,"waterfall,nature",Jun-Sep,Jog Falls Karnataka,Massive falls|Best in monsoon|Road little rough|Foggy view|Good for families,0.84,
Belur Chennakeshava Temple,temple,Hassan,13.1631,75.8672,Hoysala-era temple famous for detailed stone sculptures.,https://source.unsplash.com/800x500/?Belur%20Temple,85,80,Good,88,Medium,7,6,"temple,Hoysala,heritage",Oct-Feb,Belur Chennakeshava Temple,Outstanding carvings|Not crowded|Great history|Peaceful|Photography allowed,0.87,
Halebidu Hoysaleswara Temple,temple,Hassan,13.2101,75.9927,12th-century Hoysala temple with intricate carvings.,https://source.unsplash.com/800x500/?Halebidu%20Temple,84,78,Good,87,Medium,6,5,"temple,Hoysala",Oct-Feb,Halebidu Hoysaleswara Temple,Stunning sculptures|Calm place|Informative|Nice stone work|Good ambience,0.85,
Bandipur National Park,wildlife,Chamarajanagar,11.6548,76.6273,"Tiger reserve known for elephants, deer and safaris.",https://source.unsplash.com/800x500/?Bandipur,88,75,Good,70,Medium,5,6,"wildlife,safari,forest",Oct-May,Bandipur National Park,Saw elephants|Safari was good|Dusty roads|Nice forest|Worth it,0.82,
Nagarhole National Park,wildlife,Mysuru,12.0437,76.1269,A major wildlife sanctuary with rich biodiversity.,https://source.unsplash.com/800x500/?Nagarhole,86,73,Good,72,Medium,5,6,"wildlife,safari",Oct-May,Nagarhole National Park,Beautiful forest|Animals visible|Calm place|Nice safari|Good weather,0.81,
Coorg Abbey Falls,waterfall,Kodagu,12.4572,75.704,Popular waterfall in Coorg inside coffee plantations.,https://source.unsplash.com/800x500/?Abbey%20Falls,83,70,Moderate,80,High,7,7,"waterfall,coorg",Oct-Feb,Abbey Falls Coorg,Beautiful walkway|Crowded|Nice photos|Cool weather|Good nature spot,0.8,
Shivanasamudra Falls,waterfall,Mandya,12.287,76.556,Twin segmented waterfalls on the Kaveri River.,https://source.unsplash.com/800x500/?Shivanasamudra,79,65,Moderate,70,Seasonal,6,7,"waterfall,Kaveri",Jun-Sep,Shivanasamudra Falls,Full in monsoon|Nice view|Very crowded|Parking issue|Beautiful nature,0.76,
Badami Cave Temples,heritage,Bagalkot,15.9149,75.6768,Ancient cave temples carved from red sandstone cliffs.,https://source.unsplash.com/800x500/?Badami%20Caves,82,68,Moderate,78,Medium,6,6,"heritage,cave",Oct-Feb,Badami Cave Temples,Great carvings|Hot weather|Nice lake view|Historic site|Good trek,0.79,
Pattadakal,heritage,Bagalkot,15.9474,75.813,UNESCO heritage site of Chalukya temples.,https://source.unsplash.com/800x500/?Pattadakal,81,67,Moderate,80,Medium,6,6,"heritage,UNESCO",Oct-Feb,Pattadakal Karnataka,Very historic|Quiet place|Good architecture|Worth study|Peaceful,0.78,
Gokarna Om Beach,beach,Uttara Kannada,14.5174,74.3151,Scenic beach shaped like the Sanskrit 'Om'.,https://source.unsplash.com/800x500/?Om%20Beach,88,60,Moderate,73,High,7,8,"beach,coastal",Oct-Feb,Om Beach Gokarna,Great water|Nice cafes|Crowded|Good waves|Beautiful sunset,0.82,
Murudeshwar Temple,temple,Uttara Kannada,14.0943,74.489,Famous Shiva temple with 123-ft statue near the sea.,https://source.unsplash.com/800x500/?Murudeshwar,90,72,Good,85,High,7,6,"temple,coastal",Oct-Feb,Murudeshwar Temple,Amazing statue|Great view|Crowded|Spiritual place|Nice beach,0.84,
Udupi Sri Krishna Temple,temple,Udupi,13.3409,74.7421,Ancient temple and center of Dvaita philosophy.,https://source.unsplash.com/800x500/?Udupi%20Temple,84,75,Good,90,High,7,6,"temple,udupi",Oct-Feb,Udupi Krishna Temple,Very divine|Clean|Good food|Crowded|Nice experience,0.86,
Chitradurga Fort,fort,Chitradurga,14.2251,76.398,Massive fort with ancient structures and hills.,https://source.unsplash.com/800x500/?Chitradurga%20Fort,83,72,Good,78,Medium,6,6,"fort,heritage",Oct-Feb,Chitradurga Fort,Big fort|Good trekking|Hot mid-day|Historic|Good views,0.8,
Bangalore Palace,palace,Bengaluru,12.9987,77.592,Tudor-style palace built in 1878.,https://source.unsplash.com/800x500/?Bangalore%20Palace,82,70,Moderate,88,High,7,6,"palace,architecture",Oct-Mar,Bangalore Palace,Beautiful interiors|Expensive ticket|Royal vibe|Nice gardens|Good photos,0.81,
Nandi Hills,hill_station,Chikkaballapur,13.3829,77.683,Popular sunrise viewpoint near Bengaluru.,https://source.unsplash.com/800x500/?Nandi%20Hills,92,65,Moderate,85,High,8,7,"hills,view",Sep-Mar,Nandi Hills,Amazing sunrise|Crowded weekends|Cool breeze|Nice drive|Great views,0.85,
Kudremukh,hill_station,Chikkamagaluru,13.1373,75.2538,Lush green mountain famous for trekking.,https://source.unsplash.com/800x500/?Kudremukh,87,70,Good,78,Medium,6,7,"hill,trek",Oct-Feb,Kudremukh Trek,Great trek|Beautiful scenery|Leeches in rain|Tiring|Very green,0.82,
Somanathapura Temple,temple,Mysuru,12.1856,76.7411,Hoysala-style Keshava temple with carvings.,https://source.unsplash.com/800x500/?Somanathapura,80,76,Good,87,Low,7,6,"temple,Hoysala",Oct-Feb,Somanathapura Temple,Beautiful carvings|Calm place|Not crowded|Historic|Great art,0.84,
Ranganathittu Bird Sanctuary,wildlife,Mysuru,12.4193,76.6803,"Riverine bird habitat, boating available.",https://source.unsplash.com/800x500/?Bird%20Sanctuary,78,72,Good,82,Medium,8,8,"wildlife,birds",Nov-Mar,Ranganathittu Bird Sanctuary,Great birds|Nice boat ride|Relaxing|Good guides|Family friendly,0.79,
Bijapur - Gol Gumbaz,heritage,Vijayapura,16.83,75.715,Monumental mausoleum with the second-largest dome in the world.,https://source.unsplash.com/800x500/?Gol%20Gumbaz,86,68,Moderate,80,Medium,6,5,"gol-gumbaz,heritage",Oct-Feb,Gol Gumbaz Bijapur,Echo chamber is amazing|Stairs steep|Good history|Guide useful|Crowded,0.8,
Aihole - Temple Complex,heritage,Bagalkot,15.951,75.7458,Ancient cradle of temple architecture with many rock-cut and structural temples.,https://source.unsplash.com/800x500/?Aihole,78,64,Moderate,75,Low,6,5,"aihole,heritage",Oct-Feb,Aihole Karnataka,Architectural gem|Quiet site|Best for study|Few amenities|Nice photography,0.77,
Belagavi Fort,heritage,Belagavi,15.855,74.504,Historic fort with layered history under multiple rulers and museums.,https://source.unsplash.com/800x500/?Belagavi%20Fort,72,60,Moderate,70,Low,6,5,"fort,heritage",Oct-Feb,Belagavi Fort,Old fort|Nice walk|Local guides|Limited signage|Clean area,0.71,
Gokak Falls,waterfall,Belagavi,16.1306,74.7849,Scenic waterfall with colonial-era suspension bridge and picturesque views.,https://source.unsplash.com/800x500/?Gokak%20Falls,74,62,Moderate,72,Medium,6,7,"waterfall,scenic",Jun-Sep,Gokak Falls Karnataka,Beautiful cascade|Steps to view|Photography spot|Access roads narrow|Pleasant,0.73,
Lepakshi Veerabhadra Temple,temple,Anantapur(near),14.7225,77.7199,Famous for hanging pillar and Vijayanagara-era sculptures (near Karnataka border).,https://source.unsplash.com/800x500/?Lepakshi,75,66,Moderate,78,Medium,6,5,"temple,hang-pillar",Oct-Feb,Lepakshi Temple,Hanging pillar fascinating|Intricate carvings|Short visit|Good guides|Cultural,0.74,
Hoysala Temples - Belur & Halebidu (pair),heritage,Hassan,13.1626,75.8536,Two nearby Hoysala towns with exquisitely carved temples; art and history hub.,https://source.unsplash.com/800x500/?Belur%20Halebidu,83,77,Good,85,Medium,7,6,"hoysala,temple",Oct-Feb,Belur Halebidu Temples,Sculptures stunning|Close together|Calm|Great for study|Guided tours,0.82,
Bijapur Ibrahim Rauza,heritage,Vijayapura,16.8266,75.72,"Beautiful tomb and mosque complex, often compared to Taj for its symmetry.",https://source.unsplash.com/800x500/?Ibrahim%20Rauza,75,65,Moderate,78,Low,6,5,"tomb,heritage",Oct-Feb,Ibrahim Rauza Bijapur,Serene place|Symmetry impressive|Low crowd|Nice architecture|Peaceful,0.76,
Dolphin's Nose (Coorg viewpoint),viewpoint,Kodagu,12.434,75.684,Prominent viewpoint with dramatic cliffs and misty valleys in Coorg.,https://source.unsplash.com/800x500/?Coorg%20viewpoint,80,66,Good,76,Medium,6,7,"viewpoint,coorg",Oct-Feb,Dolphin's Nose Coorg,Spectacular view|Best sunrise|Requires short trek|Cool weather|Crowded weekends,0.8,
Nandi Temple (Nandi Hills),temple,Chikkaballapur,13.3719,77.6835,Historic temple atop Nandi Hills with panoramic views.,https://source.unsplash.com/800x500/?Nandi%20Temple,82,64,Moderate,84,High,7,6,"temple,nandi",Sep-Mar,Nandi Temple Nandi Hills,Sunrise view great|Crowded|Short walk|Food stalls around|Good for mornings,0.81,
Talakad (sand-covered temples),heritage,Mysuru,12.191,76.689,Group of buried temples on Kaveri riverbed with unique sand burial history.,https://source.unsplash.com/800x500/?Talakad,73,58,Moderate,70,Low,5,4,"heritage,buried-temples",Oct-Feb,Talakad Karnataka,Interesting history|Sparse facilities|Unique site|Best with guide|Quiet,0.7,
Kundadri Hill,viewpoint,Dakshina Kannada,13.229,75.561,Granite hill with ancient Jain basadis and panoramic views.,https://source.unsplash.com/800x500/?Kundadri,68,60,Moderate,74,Low,6,5,"hill,jain",Oct-Feb,Kundadri Hill,Peaceful place|Bit of climb|Nice views|Quiet visit|Good for solitude,0.68,
Nallur (Hoysala site),heritage,Hassan,13.02,75.8,Lesser-known Hoysala-era temple complex with fine carvings.,https://source.unsplash.com/800x500/?Hoysala%20temple,66,57,Moderate,72,Low,6,5,"hoysala,heritage",Oct-Feb,Nallur Hoysala Temple,Hidden gem|Not crowded|Great carvings|Limited amenities|Calm,0.66,
Yana Caves,viewpoint,Uttara Kannada,14.9715,74.5909,Karst rock formations and caves popular for trekking and unique geology.,https://source.unsplash.com/800x500/?Yana%20Caves,79,63,Good,75,Medium,6,7,"cave,rock-formation",Oct-Feb,Yana Caves Karnataka,Striking rocks|Trek required|Scenic|Best during dry months|Good for hikers,0.78,
Maravanthe Beach,beach,Udupi,13.624,74.395,Unique coastal stretch with a highway on one side and sea on the other.,https://source.unsplash.com/800x500/?Maravanthe%20Beach,77,58,Moderate,70,Medium,7,8,"beach,coast",Oct-Feb,Maravanthe Beach,Unique view|Great drive|Not many facilities|Peaceful|Nice sunset,0.75,
St. Mary's Islands,beach,Udupi,13.4576,74.72,Geologically-formed columnar basaltic lava islands accessible by boat.,https://source.unsplash.com/800x500/?St%20Mary%20Islands,76,60,Moderate,72,Seasonal,7,8,"island,basalt",Oct-Feb,St. Mary's Islands,Interesting geology|Boat ride needed|Clear waters|Crowded season|Great photos,0.76,
Manjira Bird Sanctuary, (near),wildlife, (near),17,77,(Note: placeholder) small wetland bird area — verify exact place before final.,https://source.unsplash.com/800x500/?Bird%20sanctuary,60,50,Moderate,60,Low,7,7,"bird,wetland",Nov-Mar,Manjira Bird Sanctuary Karnataka,Nice birds|Limited amenities|Ideal for birders|Quiet|Check access,0.6
Bheemeshwari (fishing & adventure),adventure,Ramanagara,12.875,77.1,"River island with angling, coracle rides and adventure options.",https://source.unsplash.com/800x500/?Bheemeshwari,81,70,Good,77,Medium,7,8,"adventure,river",Oct-Feb,Bheemeshwari Karnataka,Good for fishing|Coracle ride fun|Relaxing|Family spot|Guides available,0.79,
Shree Sonda (ancient temple),temple, Uttara Kannada,14,74.5,Ancient temple complex (verify exact local name); regional pilgrimage spot.,https://source.unsplash.com/800x500/?Sonda%20Temple,62,56,Moderate,70,Low,6,5,"temple,regional",Oct-Feb,Sonda Temple Karnataka,Quiet temple|Local importance|Limited tourist infrastructure|Serene,0.62,
Kukke Subramanya,temple,Subramanya,12.579,75.106,Temple near Western Ghats famous for serpent worship and rituals.,https://source.unsplash.com/800x500/?Kukke%20Subramanya,85,68,Good,86,High,6,5,"temple,serpent",Oct-Feb,Kukke Subramanya Temple,Devotional place|Pilgrimage crowd|Unique rituals|Must visit for devotees,0.83,
Agumbe Sunset Point,viewpoint,Shivamogga,13.5096,75.0957,Rainforest region known as the 'Cherrapunji of South India' with stunning sunsets.,https://source.unsplash.com/800x500/?Agumbe,82,68,Good,78,Medium,6,7,"agumbe,viewpoint",Oct-Feb,Agumbe Sunset Point,Great sunset|Foggy sometimes|Beautiful valley|Monkeys around|Nice drive,0.81,
Kemmangundi,hill_station,Chikkamagaluru,13.5591,75.7694,"Hill station with gardens, viewpoints, and trekking routes.",https://source.unsplash.com/800x500/?Kemmangundi,84,66,Moderate,75,Medium,6,7,"hill-station,garden",Oct-Mar,Kemmangundi,Great climate|Nice trek|Some rough roads|Scenic|Peaceful,0.79,
Hebbe Falls,waterfall,Chikkamagaluru,13.5262,75.7616,Two-stage waterfall accessed via jeep trail through thick forests.,https://source.unsplash.com/800x500/?Hebbe%20Falls,83,62,Moderate,72,Medium,5,7,"waterfall,forest",Jun-Sep,Hebbe Falls,Amazing falls|Jeep ride fun|Slippery rocks|Crowded weekends|Cool weather,0.78,
Sirsi Marikamba Temple,temple,Uttara Kannada,14.619,74.837,"Historic temple dedicated to goddess Marikamba, known for its large fairs.",https://source.unsplash.com/800x500/?Sirsi%20Temple,74,70,Good,83,High,7,6,"temple,sirsi",Oct-Feb,Sirsi Marikamba Temple,Festive atmosphere|Big crowds|Well maintained|Divine|Colorful,0.82,
Ramapura Dam Backwaters,nature,Chikkamagaluru,13.3,75.68,"Scenic backwater area with silence, greenery and boating.",https://source.unsplash.com/800x500/?Backwaters,69,60,Good,76,Low,7,8,"backwater,nature",Oct-Mar,Ramapura Backwaters,Peaceful|Beautiful views|Good for photos|Limited shops|Relaxing,0.74,
Shivagange,viewpoint,Tumakuru,13.0971,77.231,"Popular hill shaped like a shiva linga, known for trekking and temples.",https://source.unsplash.com/800x500/?Shivagange,77,64,Moderate,74,High,5,5,"hill,trek,temple",Oct-Feb,Shivagange,Steep climb|Great views|Monkeys trouble|Spiritual place|Challenging,0.77,
Antaragange Caves,cave,Kolar,13.133,78.129,"Volcanic rock formations, caves, and night trekking hotspot.",https://source.unsplash.com/800x500/?Antaragange,76,60,Moderate,72,Medium,5,6,"cave,trek",Oct-Mar,Antaragange Caves,Good trek|Rocks unique|Monkeys|Nice sunrise|Adventurous,0.75,
Savandurga Hill,viewpoint,Ramanagara,12.9181,77.2926,One of Asia’s largest monolith hills; popular for trekking.,https://source.unsplash.com/800x500/?Savandurga,80,62,Moderate,70,High,5,6,"hill,trek,monolith",Nov-Feb,Savandurga Hill,Tiring trek|Great views|Hot afternoon|Adventure|Best early morning,0.76,
Manchanabele Dam,nature,Ramanagara,12.888,77.299,Large reservoir surrounded by hills—known for sunset views.,https://source.unsplash.com/800x500/?Manchanabele,71,59,Moderate,72,Medium,7,8,"dam,reservoir",Oct-Mar,Manchanabele Dam,Nice sunset|Restricted swimming|Quiet|Great drive|Scenic,0.72,
Hesaraghatta Lake,nature,Bengaluru,13.139,77.478,"Dry lakebed area used for film shoots, birding and photography.",https://source.unsplash.com/800x500/?Hesaraghatta,70,54,Moderate,70,Low,7,6,"lake,birding",Nov-Feb,Hesaraghatta Lake,Serene|Good photos|Dry in summer|Open land|Nice views,0.7,
Freedom Park,museum,Bengaluru,12.9795,77.5737,Old Central Jail turned urban cultural space.,https://source.unsplash.com/800x500/?Bangalore%20Park,62,60,Good,80,Medium,8,8,"park,museum",Year-round,Freedom Park Bangalore,Good park|Open spaces|Historic jail|Family place|Calm,0.71,
Iskcon Temple,temple,Bengaluru,13.0099,77.5511,Modern Krishna temple known for architecture and cultural programs.,https://source.unsplash.com/800x500/?Iskcon%20Bangalore,88,75,Good,92,High,9,9,"temple,ISKCON",Year-round,Iskcon Temple Bangalore,Very clean|Divine|Organised|Crowded|Good prasadam,0.9,
Gaganachukki Falls,waterfall,Mandya,12.282,76.557,Part of Shivanasamudra twin falls; powerful cascades during monsoon.,https://source.unsplash.com/800x500/?Gaganachukki,79,63,Moderate,72,High,6,7,"waterfall,cauvery",Jun-Sep,Gaganachukki Falls,Strong flow|Slippery|Spectacular|Great for photos|Crowded,0.78,
Balmuri Falls,nature,Mysuru,12.422,76.541,"Man-made check dam popular for photos, water play and film shoots.",https://source.unsplash.com/800x500/?Balmuri,75,58,Moderate,70,High,8,8,"falls,mysore",Oct-Mar,Balmuri Falls,Fun spot|Crowded|Good for families|Shallow water|Hot afternoons,0.77,
Chunchi Falls,waterfall,Ramanagara,12.552,77.45,Rocky waterfall surrounded by forested landscape.,https://source.unsplash.com/800x500/?Chunchi%20Falls,72,55,Moderate,68,Low,6,7,"waterfall,rocky",Jun-Sep,Chunchi Falls,Scenic|Slippery rocks|Remote|Good photos|Not commercial,0.71,
Antharsanthe - Kabini Backwaters,wildlife,Mysuru,12.034,76.365,"Backwater area famous for elephants, tigers and boat safaris.",https://source.unsplash.com/800x500/?Kabini,85,70,Good,82,Medium,7,7,"kabini,wildlife",Oct-May,Kabini Backwaters,Saw wildlife|Great safari|Expensive|Beautiful|Good guides,0.83,
Gavi Gangadhareshwara Temple,temple,Bengaluru,12.9498,77.5436,Rock-cut temple famous for sun-ray alignment phenomenon.,https://source.unsplash.com/800x500/?Gavi%20Temple,76,72,Good,84,High,7,6,"temple,rockcut",Jan-only,Gavi Gangadhareshwara Temple,Amazing sun phenomenon|Crowded|Ancient|Good experience|Unique place,0.82,
Hampi Lotus Mahal,heritage,Vijayanagara,15.3187,76.4652,Elegant Indo-Islamic pavilion inside Hampi's Zenana enclosure.,https://source.unsplash.com/800x500/?Lotus%20Mahal,82,68,Good,82,Medium,6,6,"lotus,heritage",Oct-Feb,Hampi Lotus Mahal,Beautiful structure|Nice gardens|Historic|Great photos|Calm,0.83,
Matanga Hill,hill_station,Hampi,15.33,76.4719,Best sunrise viewpoint in Hampi; moderate trek.,https://source.unsplash.com/800x500/?Matanga%20Hill,84,60,Moderate,70,Medium,5,6,"hill,trek,Hampi",Oct-Feb,Matanga Hill,Awesome sunrise|Trek challenging|Hot|Best morning|Great scenery,0.8,
Unakal Lake,lake,Hubballi,15.3645,75.1112,"Urban lake with boating, walking paths and Buddha statue.",https://source.unsplash.com/800x500/?Unakal%20Lake,72,65,Good,74,Medium,8,8,"lake,hubli",Oct-Mar,Unakal Lake,Clean|Nice boating|Evening place|Crowded weekends|Peaceful,0.76,
Kokkare Bellur Bird Sanctuary,wildlife,Mandya,12.521,77.003,Village sanctuary known for painted storks and pelicans nesting near homes.,https://source.unsplash.com/800x500/?Bird%20Sanctuary,70,62,Good,78,Low,8,7,"bird,wetland",Dec-Mar,Kokkare Bellur Bird Sanctuary,Great birdwatching|Village charm|Calm place|Seasonal|Good photos,0.74,
Banavasi Madhukeshwara Temple,temple,Uttara Kannada,14.8837,74.8552,Ancient 9th-century temple from Kadamba dynasty.,https://source.unsplash.com/800x500/?Banavasi%20Temple,78,70,Good,82,Low,7,6,"temple,kadamba",Oct-Mar,Banavasi Madhukeshwara Temple,Historic site|Calm|Good sculptures|Less crowded|Peaceful,0.82,
Tadiandamol Peak,hill_station,Kodagu,12.2145,75.676,"Second-highest peak of Karnataka, popular trekking destination.",https://source.unsplash.com/800x500/?Tadiandamol,86,65,Moderate,75,Medium,5,6,"trek,peak",Oct-Feb,Tadiandamol Peak,Amazing trek|Steep sections|Scenic|Cool climate|Worth it,0.81,
Pushpagiri Wildlife Sanctuary,wildlife,Kodagu,12.348,75.676,Biodiversity hotspot with dense forests and trekking paths.,https://source.unsplash.com/800x500/?Pushpagiri,77,60,Moderate,72,Low,6,7,"wildlife,forest",Oct-Mar,Pushpagiri Wildlife Sanctuary,Beautiful forests|Good trek|Remote|Quiet|Great for nature lovers,0.75,
Devarayanadurga,hill_station,Tumakuru,13.3704,77.2047,Forest-covered hill with temples and panoramic viewpoints.,https://source.unsplash.com/800x500/?Devarayanadurga,74,62,Moderate,76,Medium,7,7,"hill,temple",Oct-Mar,Devarayanadurga,Nice drive|Great views|Crowded weekends|Calm top|Pleasant weather,0.77,
Banashankari Temple Badami,temple,Bagalkot,15.913,75.6815,Famous Dravidian temple dedicated to Banashankari Devi.,https://source.unsplash.com/800x500/?Banashankari%20Temple,79,68,Good,85,Medium,7,6,"temple,heritage",Oct-Mar,Banashankari Temple Badami,Spiritual|Cultural fair|Peaceful|Historic|Clean,0.82,
Cottonpet Market (traditional craft),market,Bengaluru,12.959,77.573,Historic craft and textile market with local artisans.,https://source.unsplash.com/800x500/?Bangalore%20market,67,55,Moderate,70,High,7,7,"market,craft",Year-round,Cottonpet Market,Colorful|Crowded|Good bargains|Busy streets|Cultural vibe,0.7,
Gulbarga (Kalaburagi) Fort,fort,Kalaburagi,17.333,76.837,Large medieval fort with Jama Masjid inside.,https://source.unsplash.com/800x500/?Kalaburagi%20Fort,72,63,Moderate,75,Low,6,6,"fort,heritage",Oct-Feb,Gulbarga Fort,Old fort|Huge structure|Nice masjid|Quiet place|Needs more signage,0.73,
Sri Manjunatha Temple Dharmasthala,temple,Dakshina Kannada,12.9569,75.3794,Major pilgrimage site on the banks of Netravati river.,https://source.unsplash.com/800x500/?Dharmasthala,88,78,Good,92,High,7,6,"temple,dharmasthala",Oct-Feb,Dharmasthala Temple,Divine|Organized|Very crowded|Clean|Peaceful,0.86,
Sharavathi Backwaters,nature,Shivamogga,14.2,74.8,Massive backwaters surrounded by forests and viewpoints.,https://source.unsplash.com/800x500/?Sharavathi,80,68,Good,78,Medium,7,7,"backwater,forest",Oct-Mar,Sharavathi Backwaters,Calm|Nature rich|Great pics|Limited shops|Beautiful,0.8,
Marikamba Temple Sagara,temple,Shivamogga,14.167,75.02,Famous Marikamba Devi temple with vibrant festivals.,https://source.unsplash.com/800x500/?Sagara%20Temple,76,70,Good,84,High,7,6,"temple,festival",Oct-Feb,Marikamba Temple Sagara,Divine|Festive|Very crowded yearly|Spiritual|Clean,0.8,
Baba Budangiri,hill_station,Chikkamagaluru,13.404,75.783,"Mountain range known for caves, viewpoints and trekking routes.",https://source.unsplash.com/800x500/?Baba%20Budangiri,85,63,Moderate,75,Medium,6,7,"hill,trek,chikkamagalur",Oct-Feb,Baba Budangiri,Great views|Cool climate|Crowded weekends|Nice drive|Cloudy,0.82,
Hirekolale Lake,lake,Chikkamagaluru,13.39,75.77,"Scenic lake surrounded by hills, great for photos.",https://source.unsplash.com/800x500/?Hirekolale%20Lake,78,67,Good,82,Low,8,8,"lake,chikkamagaluru",Oct-Mar,Hirekolale Lake,Beautiful spot|Peaceful|Good pics|Empty on weekdays|Nature rich,0.8,
Talacauvery,temple,Kodagu,12.432,75.534,Origin point of river Cauvery with temple and hill views.,https://source.unsplash.com/800x500/?Talacauvery,82,72,Good,88,Medium,7,6,"cauvery,temple",Oct-Feb,Talacauvery Coorg,Clean|Sacred|Steps to climb|Nice views|Well maintained,0.83,
Sringeri Sharada Peetham,temple,Chikkamagaluru,13.416,75.252,Ancient Advaita matha established by Adi Shankaracharya.,https://source.unsplash.com/800x500/?Sringeri,86,78,Good,90,Medium,8,8,"temple,matha",Oct-Mar,Sringeri Temple,Very spiritual|Calm|Clean|Great river view|Peaceful stay,0.89,
Utsav Rock Garden,museum,Shivamogga,14.2144,75.0337,Folk-art museum with life-sized sculptures depicting rural Karnataka.,https://source.unsplash.com/800x500/?Rock%20Garden,74,70,Good,84,Medium,8,8,"museum,sculpture",Oct-Mar,Utsav Rock Garden,Great art|Nice exhibits|Educational|Good photos|Unique place,0.82,
Mahadev Temple Itagi,temple,Koppal,15.353,76.167,11th-century Chalukya temple known for detailed carvings.,https://source.unsplash.com/800x500/?Itagi%20Temple,71,67,Good,80,Low,7,6,"temple,chalukya",Oct-Feb,Mahadev Temple Itagi,Beautiful carvings|Remote|Quiet|Ancient|Great for architecture lovers,0.78,
Anshi (Kali) Tiger Reserve,wildlife,Uttara Kannada,14.9,74.45,"Reserved forest with black panthers, tigers and trekking trails.",https://source.unsplash.com/800x500/?Kali%20Tiger%20Reserve,78,65,Moderate,74,Low,6,7,"wildlife,forest",Nov-Apr,Anshi Tiger Reserve,Dense forest|Rare sightings|Calm|Great nature|Remote area,0.77,
Mekedatu,nature,Ramanagara,12.2635,77.4361,Deep gorge where river Kaveri flows through narrow rocks.,https://source.unsplash.com/800x500/?Mekedatu,75,60,Moderate,72,Medium,6,7,"gorge,kaveri",Oct-Feb,Mekedatu Karnataka,Great rock formations|Strong currents|Nice trek|Nature spot|Adventurous,0.76,
KRS Backwaters Brindavan Gardens,nature,Mysuru,12.4219,76.5723,Iconic gardens near KRS dam with musical fountains.,https://source.unsplash.com/800x500/?Brindavan%20Gardens,89,78,Good,90,High,8,8,"garden,dam",Oct-Feb,Brindavan Gardens,Beautiful lights|Crowded|Good landscaping|Family spot|Classic tourist place,0.88,
Kapu Lighthouse Beach,beach,Udupi,13.2073,74.7355,Golden sand beach with a historic lighthouse overlooking the Arabian Sea.,https://source.unsplash.com/800x500/?Kapu%20Beach,80,66,Good,82,Medium,7,8,"beach,lighthouse",Oct-Mar,Kapu Lighthouse Beach,Beautiful sunset|Clean|Lighthouse view|Moderate crowd|Must visit,0.82,
Kadri Manjunatha Temple,temple,Mangaluru,12.8963,74.856,Ancient Shiva temple with Buddhist-Jain architectural influences.,https://source.unsplash.com/800x500/?Kadri%20Temple,85,78,Good,88,High,7,6,"temple,mangalore",Oct-Feb,Kadri Manjunatha Temple,Peaceful|Historic|Divine place|Well maintained|Crowded weekends,0.87,
Panambur Beach,beach,Mangaluru,12.9582,74.814,One of Karnataka’s safest and cleanest beaches with amenities.,https://source.unsplash.com/800x500/?Panambur%20Beach,88,80,Good,90,High,8,9,"beach,mangalore",Oct-Mar,Panambur Beach,Clean beach|Water sports|Crowded|Good for families|Great vibe,0.9,
Kudle Beach,beach,Gokarna,14.525,74.3151,"Laid-back beach with cafes, ideal for swimming and sunsets.",https://source.unsplash.com/800x500/?Kudle%20Beach,82,65,Moderate,82,Medium,8,9,"beach,gokarna",Oct-Mar,Kudle Beach,Relaxing|Good food|Soft sand|Moderate crowd|Great view,0.84,
Mirjan Fort,fort,Uttara Kannada,14.485,74.42,Historic laterite fort known for its scenic architecture.,https://source.unsplash.com/800x500/?Mirjan%20Fort,78,72,Good,84,Low,7,7,"fort,heritage",Oct-Mar,Mirjan Fort,Beautiful fort|Green surroundings|Quiet|Nice walk|Good photos,0.82,
Sharavathi Adventure Camp,wildlife,Shivamogga,14.219,74.861,"Backwater eco-resort offering trekking, kayaking and birdwatching.",https://source.unsplash.com/800x500/?Sharavathi,83,70,Good,82,Medium,7,8,"adventure,nature",Oct-Apr,Sharavathi Adventure Camp,Great activities|Nature rich|Good food|Calm|Nice views,0.83,
Sakleshpur Manjarabad Fort,fort,Hassan,12.9962,75.696,"Star-shaped fort built by Tipu Sultan, known for viewpoints.",https://source.unsplash.com/800x500/?Manjarabad%20Fort,76,62,Moderate,75,Medium,6,6,"fort,tipu",Oct-Mar,Manjarabad Fort,Unique design|Nice views|Steep steps|Crowded weekends|Good visit,0.79,
Banerghatta Biological Park,wildlife,Bengaluru,12.8,77.577,"Large zoo, safari park and butterfly garden near Bengaluru.",https://source.unsplash.com/800x500/?Bannerghatta,88,76,Good,84,High,9,9,"zoo,safari",Year-round,Bannerghatta Biological Park,Good safari|Crowded|Great for kids|Clean|Lots of animals,0.88,
Harangi Dam,nature,Kodagu,12.472,75.869,Peaceful dam area surrounded by greenery and calm waters.,https://source.unsplash.com/800x500/?Harangi%20Dam,75,66,Good,78,Low,8,8,"dam,coorg",Oct-Mar,Harangi Dam,Quiet|Nice view|Peaceful walk|Limited shops|Good photos,0.8,
Dubare Elephant Camp,wildlife,Kodagu,12.343,75.8681,Elephant interaction camp offering bathing and feeding experiences.,https://source.unsplash.com/800x500/?Dubare%20Elephant,90,70,Good,84,High,8,7,"elephant,coorg",Oct-Feb,Dubare Elephant Camp,Great elephants|Fun for kids|Crowded|Good guides|Unique experience,0.89,
Abbey Falls (Coorg),waterfall,Kodagu,12.4572,75.704,"Waterfall inside coffee plantations, popular tourist spot.",https://source.unsplash.com/800x500/?Abbey%20Falls,88,68,Moderate,80,High,7,8,"coorg,waterfall",Oct-Feb,Abbey Falls,Scenic|Crowded|Nice walkway|Good photos|Seasonal flow,0.84,
Kotte Betta Peak,hill_station,Kodagu,12.331,75.653,"One of the highest peaks in Coorg, good trekking routes.",https://source.unsplash.com/800x500/?Kotte%20Betta,78,60,Moderate,75,Medium,6,7,"trek,hill",Oct-Mar,Kotte Betta,Green trails|Scenic|Tiring climb|Good group trek|Peaceful,0.78,
Jaladurga Fort,heritage,Raichur,16.198,76.849,Fort located on an island formed by Krishna river.,https://source.unsplash.com/800x500/?Jaladurga%20Fort,70,60,Moderate,72,Low,6,6,"fort,island",Oct-Feb,Jaladurga Fort,Unique island fort|Remote|Great views|Quiet|Needs maintenance,0.72,
Gavi Betta (hillside temple),temple,Tumakuru,13.45,76.95,Hilltop temple with panoramic countryside views.,https://source.unsplash.com/800x500/?Gavi%20Betta,68,62,Moderate,75,Low,7,6,"temple,viewpoint",Oct-Mar,Gavi Betta,Good views|Calm|Steep road|Nice temple|Peaceful,0.7,
Keladi Rameshwara Temple,temple,Shivamogga,14.244,75.061,Historic temple with Vijayanagara-era architecture.,https://source.unsplash.com/800x500/?Keladi,74,70,Good,82,Low,7,6,"temple,heritage",Oct-Feb,Keladi Rameshwara Temple,Ancient|Clean|Quiet|Nice carvings|Good place,0.8,
Gende Hosalli Bird Sanctuary,wildlife,Mandya,12.347,76.67,Riparian bird sanctuary great for nature lovers.,https://source.unsplash.com/800x500/?Mandya%20Bird,62,58,Moderate,70,Low,7,7,"bird,nature",Nov-Mar,Gende Hosalli Sanctuary,Calm|Birds abundant|Simple place|Good morning visit|Photography spot,0.69,
Jayanagar 4th Block Market,market,Bengaluru,12.9255,77.6064,"Popular market for food, clothing and street shopping.",https://source.unsplash.com/800x500/?Bangalore%20market,72,65,Good,80,High,8,8,"market,shopping",Year-round,Jayanagar Market,Crowded|Good food|Trendy shops|Affordable|Busy area,0.76,
Benne Hole Falls,waterfall,Uttara Kannada,14.9814,74.5544,Less-crowded waterfall accessed through lush forests.,https://source.unsplash.com/800x500/?Benne%20Hole%20Falls,75,60,Moderate,72,Low,6,7,"waterfall,forest",Jun-Sep,Benne Hole Falls,Scenic|Remote|Great greenery|Slippery|Good adventure,0.76,
Kodachadri Peak,hill_station,Shivamogga,13.8662,74.8415,Beautiful mountain peak popular for trekking and Jeep trails.,https://source.unsplash.com/800x500/?Kodachadri,89,70,Good,80,Medium,5,7,"hill,trek",Oct-Feb,Kodachadri Peak,Amazing trek|Jeep ride thrilling|Great views|Tiring|Worth all effort,0.88,
Jogimatti Forest Reserve,wildlife,Chitradurga,14.167,76.413,"Hilly reserve with viewpoints, forest trails and wildlife.",https://source.unsplash.com/800x500/?Jogimatti,70,62,Moderate,76,Low,7,7,"forest,hills",Oct-Mar,Jogimatti Reserve,Nice view|Quiet spot|Fresh air|Simple trails|Ideal morning trip,0.74`;

// Robust CSV Parser
const parseLine = (text: string): string[] => {
  const result: string[] = [];
  let cur = '';
  let inQuote = false;
  
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    
    if (inQuote) {
      if (char === '"') {
        if (i + 1 < text.length && text[i + 1] === '"') {
          // Double quote inside quoted field -> single quote
          cur += '"';
          i++;
        } else {
          inQuote = false;
        }
      } else {
        cur += char;
      }
    } else {
      if (char === '"') {
        inQuote = true;
      } else if (char === ',') {
        result.push(cur.trim());
        cur = '';
      } else {
        cur += char;
      }
    }
  }
  result.push(cur.trim());
  return result;
};

const parseCSV = (csv: string): Place[] => {
  const lines = csv.trim().split('\n');
  
  return lines.slice(1).map((line, index) => {
    // Use manual parser instead of regex
    const parts = parseLine(line);

    if (!parts || parts.length < 5) return null;

    // place_name,category,district,latitude,longitude,...
    const name = parts[0]?.trim();
    if (!name) return null;

    const catRaw = parts[1]?.trim().toLowerCase() || '';
    const district = parts[2]?.trim() || '';
    
    const latStr = parts[3];
    const lngStr = parts[4];
    const lat = latStr ? parseFloat(latStr) : NaN;
    const lng = lngStr ? parseFloat(lngStr) : NaN;
    
    const description = parts[5]?.trim() || '';
    let image = parts[6]?.trim();
    const popScore = parseInt(parts[7]) || 0;
    const maintScore = parseInt(parts[8]) || 0;
    const safeScore = parseInt(parts[10]) || 0;
    const tagsRaw = parts[14]?.trim();
    const bestTime = parts[15]?.trim();
    const sentiment = parseFloat(parts[18]);

    // IMAGE VALIDATION: 
    // Unsplash Source is deprecated/unreliable. We treat these as invalid
    // so the app can fall back to the OSM API image during enrichment.
    if (image && (image.includes('source.unsplash.com') || image.includes('picsum.photos'))) {
      image = PLACEHOLDER_IMAGE;
    }

    // Map Category
    let category = PlaceCategory.HERITAGE;
    if (catRaw.includes('temple')) category = PlaceCategory.TEMPLE;
    else if (catRaw.includes('waterfall')) category = PlaceCategory.WATERFALL;
    else if (catRaw.includes('hill')) category = PlaceCategory.HILL_STATION;
    else if (catRaw.includes('fort')) category = PlaceCategory.FORT;
    else if (catRaw.includes('beach')) category = PlaceCategory.BEACH;
    else if (catRaw.includes('wildlife') || catRaw.includes('forest') || catRaw.includes('bird')) category = PlaceCategory.WILDLIFE;
    else if (catRaw.includes('cave')) category = PlaceCategory.NATURE;
    else if (catRaw.includes('nature') || catRaw.includes('lake') || catRaw.includes('dam')) category = PlaceCategory.NATURE;
    else if (catRaw.includes('market') || catRaw.includes('museum') || catRaw.includes('culture')) category = PlaceCategory.CULTURE;
    else if (catRaw.includes('palace')) category = PlaceCategory.HERITAGE;
    else if (catRaw.includes('adventure')) category = PlaceCategory.NATURE;
    else if (catRaw.includes('viewpoint')) category = PlaceCategory.HILL_STATION;

    return {
      id: `csv-${index}`,
      name: name,
      category: category,
      description: description,
      fullDescription: `${description} Located in ${district}. Known for: ${tagsRaw}`,
      location: { lat, lng },
      // Use strictly validated image or placeholder
      image: (image && image.length > 5) ? image : PLACEHOLDER_IMAGE,
      rating: 4.0 + (popScore / 100), 
      safetyScore: safeScore,
      popularityScore: popScore,
      maintenanceScore: maintScore,
      sentimentScore: isNaN(sentiment) ? undefined : sentiment,
      bestTimeToVisit: bestTime || 'Year-round',
      tags: tagsRaw ? tagsRaw.split(',').map(t => t.trim()) : [],
      district: district, // Include district for Wikipedia lookup
      source: 'dataset'
    } as Place;
  }).filter((p): p is Place => p !== null);
};

export const getDatasetPlaces = (): Place[] => {
  return parseCSV(CSV_DATA);
};