import { useState, useEffect, useRef } from "react";
import localforage from "localforage";
import PB_CSV from '../../pre-built-csv.json';

const useCsvDataHandler = (locationState, navigate) => {
    const [data, setData] = useState(null);
    const [chunkState, setChunkState] = useState({ chunkCount: 0, currentChunkIndex: 0 });
    const [isLoading, setIsLoading] = useState(true);
    const [editedHeaders, setEditedHeaders] = useState(null);
    const skipFetch = useRef(false);

    const saveToIndexedDB = (data, type, explicitIndex) => {
        const currentIndex = explicitIndex ?? chunkState.currentChunkIndex;

        if (type === 'data') {
            if (data.chunkIndex === currentIndex) {
                localforage.setItem(`csvChunk_${currentIndex}`, data);
            }
        }
        if (type === 'headers') {
            localforage.setItem('headers', data);
        }
    }

    const updateChunk = (newRows, newHeaders) => {
        setData(prev => {
            const updated = {
                ...prev,
                ...(newHeaders && { headers: newHeaders }),
                ...(newRows && { rows: newRows })
            };
            saveToIndexedDB(updated, 'data');
            return updated;
        });
    }

    const new_CSV_creator = async () => {
        if (!locationState) return;
        const chunkCount = await localforage.getItem('csvMetadata').then((metadata) => {
            if (metadata && metadata.chunkLength) {
                return metadata.chunkLength;
            }
        });
        const Pre_built_CSV = PB_CSV;

        for (let i = 0; i < chunkCount; i++) {
            await localforage.removeItem(`csvChunk_${i}`);
        }

        if (locationState === 'new') {
            await localforage.setItem(`csvChunk_${0}`, { headers: [], rows: [], chunkIndex: 0 });
            await localforage.setItem('csvMetadata', { chunkLength: 1, totalItems: 0 });
            await localforage.setItem('headers', []);
            setChunkState({ chunkCount: 1, currentChunkIndex: 0 });
            setData({ headers: [], rows: [], chunkIndex: 0 });
            setIsLoading(false);
            return;
        }

        const model = Pre_built_CSV.find(obj => obj.CSV_Model === locationState);

        if (!model) {
            console.error("Modelo CSV não encontrado.");
            return;
        }

        const modelHeaders = model.Headers;
        await localforage.setItem(`csvChunk_${0}`, { headers: modelHeaders, rows: [], chunkIndex: 0 });
        await localforage.setItem('csvMetadata', { chunkLength: 1, totalItems: 0 });
        await localforage.setItem('headers', modelHeaders);
        setChunkState({ chunkCount: 1, currentChunkIndex: 0 });
        setData({ headers: modelHeaders, rows: [], chunkIndex: 0 });
        setIsLoading(false);
        return;

    }

    useEffect(() => {
        const getData = async () => {
            try {
                const chunkCount = await localforage.getItem('csvMetadata').then((metadata) => {
                    if (metadata && metadata.chunkLength) {
                        return metadata.chunkLength;
                    }
                });
                await new_CSV_creator();
                setChunkState(prev => ({ ...prev, chunkCount: chunkCount }));
                const currentIndex = chunkState.currentChunkIndex;

                let currentChunk = await localforage.getItem(`csvChunk_${currentIndex}`);
                if (currentChunk) {
                    const rowsWithId = currentChunk.rows.map((item, index) => ({ id: index, ...item }));
                    currentChunk.rows = rowsWithId;
                    setData(currentChunk);
                }

                setIsLoading(false);

            } catch (error) {
                console.error('Error retrieving chunk count from IndexedDB:', error);
                alert('Erro ao carregar dados do IndexedDB! Voltando para página inicial.');
                navigate('/');
            }
        }
        getData();
    }, []);



    useEffect(() => {
        if (skipFetch.current) {
            skipFetch.current = false;
            return;
        }
        const getCurrentChunk = async () => {
            try {
                let currentChunk = await localforage.getItem(`csvChunk_${chunkState.currentChunkIndex}`);
                if (currentChunk) {
                    if (editedHeaders) {
                        currentChunk.headers = editedHeaders;
                        saveToIndexedDB(currentChunk, 'data');
                    }
                    const rowsWithId = currentChunk.rows.map((item, index) => ({ id: index, ...item }));
                    currentChunk.rows = rowsWithId
                    setData(currentChunk);
                }
            } catch (error) {
                console.error('Error retrieving current chunk from IndexedDB:', error);
            }
        }
        getCurrentChunk();
    }, [chunkState.currentChunkIndex]);


    return{
        data, setData,
        editedHeaders, setEditedHeaders,
        chunkState, setChunkState,
        isLoading,
        saveToIndexedDB,
        updateChunk,
        skipFetch,
    }
}

export default useCsvDataHandler;