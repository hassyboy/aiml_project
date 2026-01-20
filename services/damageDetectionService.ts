const API_URL = 'http://localhost:5000/predict';

export interface DamagePrediction {
    className: string;
    probability: number;
}

export const analyzeImage = async (imageElement: HTMLImageElement): Promise<DamagePrediction[]> => {
    try {
        // Convert Image Element to Blob/File
        const response = await fetch(imageElement.src);
        const blob = await response.blob();

        const formData = new FormData();
        formData.append('image', blob, 'image.jpg');

        const apiResponse = await fetch(API_URL, {
            method: 'POST',
            body: formData,
        });

        if (!apiResponse.ok) {
            const errorData = await apiResponse.json();
            throw new Error(errorData.error || `Server error: ${apiResponse.status}`);
        }

        const data = await apiResponse.json();

        // Map the "all_scores" from backend to our frontend interface
        // Expected backend format: { prediction: "...", confidence: ..., all_scores: { "Class": 0.9, ... } }
        const predictions: DamagePrediction[] = Object.entries(data.all_scores || {}).map(([className, probability]) => ({
            className,
            probability: probability as number
        }));

        // Sort by probability desc
        return predictions.sort((a, b) => b.probability - a.probability);

    } catch (error: any) {
        console.error("Analysis failed:", error);
        throw new Error(error.message || "Failed to analyze image via backend");
    }
};

// Kept for compatibility if used elsewhere, but effectively no-op now
export const loadModel = async () => {
    return Promise.resolve(true);
};
