export const createCSVAPI = (url) => {

    return {
        async loadStandardCSV() {
            try {
                const response = await fetch(`${url}/`);

                if (!response.ok) {
                    throw new Erros('Failed to load CSV data');
                    alert('Failed to load CSV data');
                }

               return response.json();


            } catch (error) {
                console.error('Error loading CSV data:', error);
            }
        },

        async uploadCSV(formData) {
            const response = await fetch(`${url}/upload`, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Failed to upload CSV data');
            }

            return response.json();
        },

        async downloadCSV(payload) {
            const response = await fetch(`${url}/download`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                throw new Error(`Erro ao baixar CSV: ${response.statusText}`);
            }

            return response;
        }
    }
}