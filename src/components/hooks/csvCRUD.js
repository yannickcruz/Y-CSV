import localforage from "localforage";
import useCsvDataHandler from "./csvDataHandler";
import { useState, useRef } from "react";

const useCsvCRUD = (data, setData, chunkState, setChunkState, updateChunk, saveToIndexedDB, skipFetch) => {
    const [PopUp, setPopUp] = useState({
        addColumn: false,
        rowError: false
    });
    const [isDeleteMode, setIsDeleteMode] = useState(false);
    const isDeletingRef = useRef(false);

    const openPopUp = (PopUp_Type) => {
        if (PopUp_Type === 'AddColumn') {
            setPopUp(prev => ({ ...prev, addColumn: true }));
        }
        if (PopUp_Type === 'rowError') {
            setPopUp(prev => ({ ...prev, rowError: true }));
        }
    }


    const addNewColumn = async (columnName) => {

        for (let i = 0; i < chunkState.chunkCount; i++) {
            const chunkToUpdate = await localforage.getItem(`csvChunk_${i}`);

            const updatedRows = chunkToUpdate.rows.map((item) => {
                return { ...item, [columnName]: '' };
            });

            const updatedHeaders = [...chunkToUpdate.headers, columnName];
            chunkToUpdate.rows = updatedRows;
            chunkToUpdate.headers = updatedHeaders;

            await localforage.setItem(`csvChunk_${i}`, chunkToUpdate);
            if (chunkToUpdate.chunkIndex === data.chunkIndex) {
                updateChunk(updatedRows, updatedHeaders);
            }
        }

        const headers = data.headers;
        const newHeaders = [...headers, columnName];
        setPopUp(prev => ({
            ...prev,
            addColumn: false
        }));
        saveToIndexedDB([...headers, columnName], 'headers');
    }

    const addRow = async () => {
        const newRow = data.headers.reduce((acc, header) => {
            acc[header] = '';
            return acc;
        }, {});

        if (data.headers.length === 0) {
            openPopUp('rowError');
            return;
        }

        const L_Chunk = await localforage.getItem(`csvChunk_${chunkState.chunkCount - 1}`);

        let lastIndexUpdate = null;
        if (data.chunkIndex === L_Chunk.chunkIndex) {
            lastIndexUpdate = L_Chunk.chunkIndex;
        }

        if (data.rows.length >= 100 && L_Chunk.rows.length < 100) {
            const lastIndex = chunkState.chunkCount - 1;

            const newData = [...L_Chunk.rows, { ...newRow, id: L_Chunk.rows.length }];
            const updatedLastChunk = { ...L_Chunk, rows: newData };

            await saveToIndexedDB(updatedLastChunk, 'data', lastIndex);
            skipFetch.current = true;

            setData(updatedLastChunk);
            setChunkState(prev => ({ ...prev, currentChunkIndex: lastIndex }));
            return;
        }

        if (data.rows.length >= 100 && L_Chunk.rows.length === 100) {
            skipFetch.current = true;

            const newLastIndex = chunkState.chunkCount;
            const newHeaders = data.headers;
            const newChunkRows = [{ id: 0, ...newRow }];

            const newChunk = {
                headers: newHeaders,
                rows: newChunkRows,
                chunkIndex: newLastIndex
            };

            const newMetadata = await localforage.getItem('csvMetadata').then((metadata) => {
                return { ...metadata, chunkLength: newLastIndex + 1 }
            });
            await localforage.setItem('csvMetadata', newMetadata);

            setData(newChunk);

            await localforage.setItem(`csvChunk_${chunkState.chunkCount}`, newChunk);
            setChunkState(prev => ({ chunkCount: newLastIndex + 1, currentChunkIndex: newLastIndex }));
            return;
        }

        const newData = [...data.rows, { ...newRow, id: data.rows.length }];
        updateChunk(newData, null, lastIndexUpdate);
    }

    const deleteColumn = async (columnName) => {
        if (!isDeleteMode || !columnName) return;

        for (let i = 0; i < chunkState.chunkCount; i++) {
            const chunkToUpdate = await localforage.getItem(`csvChunk_${i}`);

            const updatedRows = chunkToUpdate.rows.map((item) => {
                const { [columnName]: _, ...rest } = item;
                return rest;
            });
            const updatedHeaders = chunkToUpdate.headers.filter(h => h !== columnName);

            chunkToUpdate.rows = updatedRows;
            chunkToUpdate.headers = updatedHeaders;

            await localforage.setItem(`csvChunk_${i}`, chunkToUpdate);

            if (chunkToUpdate.chunkIndex === data.chunkIndex) {
                updateChunk(chunkToUpdate.rows, chunkToUpdate.headers);
            }
        }

        saveToIndexedDB(data.headers.filter(h => h !== columnName), 'headers');
    }

    const deleteRow = async (rowId) => {
        if (!isDeleteMode || isDeletingRef.current) return;
        isDeletingRef.current = true;

        try {
            const reindex = (rows) => rows.map((row, index) => ({ ...row, id: index }));
            const saveChunk = (chunk) =>
                localforage.setItem(`csvChunk_${chunk.chunkIndex}`, { ...chunk, rows: reindex(chunk.rows) });

            const metadata = await localforage.getItem('csvMetadata');
            const lastIndex = metadata.chunkLength - 1;
            const currentIndex = data.chunkIndex;

            let working = { ...data, rows: data.rows.filter((item) => item.id !== rowId) };

            for (let i = currentIndex + 1; i <= lastIndex; i++) {
                const next = await localforage.getItem(`csvChunk_${i}`);
                if (!next || next.rows.length === 0) break;

                const [firstRow, ...restRows] = next.rows;
                working = { ...working, rows: [...working.rows, firstRow] };
                await saveChunk(working);

                working = { ...next, rows: restRows };
            }

            let removedLastPage = false;
            if (working.rows.length === 0 && working.chunkIndex > 0) {
                await localforage.removeItem(`csvChunk_${working.chunkIndex}`);
                await localforage.setItem('csvMetadata', { ...metadata, chunkLength: working.chunkIndex });
                removedLastPage = true;
            } else {
                await saveChunk(working);
            }

            const newChunkCount = removedLastPage ? lastIndex : lastIndex + 1;

            if (removedLastPage && currentIndex === lastIndex) {
                setChunkState({ chunkCount: newChunkCount, currentChunkIndex: currentIndex - 1 });
            } else {
                const refreshed = await localforage.getItem(`csvChunk_${currentIndex}`);
                setData(refreshed);
                setChunkState((prev) => ({ ...prev, chunkCount: newChunkCount }));
            }
        } finally {
            isDeletingRef.current = false;
        }
    };

    return {
        openPopUp, addNewColumn, addRow, deleteColumn, deleteRow, PopUp, setPopUp, isDeleteMode, setIsDeleteMode
    }
}

export default useCsvCRUD;