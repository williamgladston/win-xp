import React, { createContext, useContext, useState, useCallback } from 'react';
import { initialFileSystem } from '../data/fileSystem';

const FileSystemContext = createContext();

export function FileSystemProvider({ children }) {
  const [fs, setFs] = useState(initialFileSystem);
  const [recycleBin, setRecycleBin] = useState([]);

  const getNode = useCallback((path) => {
    const parts = path.split('/').filter(Boolean);
    let current = fs;
    for (const part of parts) {
      if (current.children && current.children[part]) {
        current = current.children[part];
      } else {
        return null;
      }
    }
    return current;
  }, [fs]);

  const listDir = useCallback((path) => {
    const node = getNode(path);
    if (!node || node.type !== 'folder') return [];
    return Object.entries(node.children || {}).map(([name, data]) => ({
      name,
      ...data,
      path: path === '/' ? `/${name}` : `${path}/${name}`,
    }));
  }, [getNode]);

  const readFile = useCallback((path) => {
    const node = getNode(path);
    if (!node || node.type !== 'file') return null;
    return node.content;
  }, [getNode]);

  const writeFile = useCallback((path, content) => {
    setFs(prev => {
      const newFs = JSON.parse(JSON.stringify(prev));
      const parts = path.split('/').filter(Boolean);
      const fileName = parts.pop();
      let current = newFs;
      for (const part of parts) {
        if (!current.children[part]) {
          current.children[part] = { type: 'folder', children: {} };
        }
        current = current.children[part];
      }
      if (current.children[fileName]) {
        current.children[fileName].content = content;
      } else {
        current.children[fileName] = { type: 'file', content, icon: '📄' };
      }
      return newFs;
    });
  }, []);

  const deleteNode = useCallback((path) => {
    setFs(prev => {
      const newFs = JSON.parse(JSON.stringify(prev));
      const parts = path.split('/').filter(Boolean);
      const name = parts.pop();
      let current = newFs;
      for (const part of parts) {
        current = current.children[part];
      }
      const deleted = { name, path, ...current.children[name] };
      setRecycleBin(rb => [...rb, deleted]);
      delete current.children[name];
      return newFs;
    });
  }, []);

  const emptyRecycleBin = useCallback(() => {
    setRecycleBin([]);
  }, []);

  return (
    <FileSystemContext.Provider
      value={{ fs, getNode, listDir, readFile, writeFile, deleteNode, recycleBin, emptyRecycleBin }}
    >
      {children}
    </FileSystemContext.Provider>
  );
}

export function useFileSystem() {
  const context = useContext(FileSystemContext);
  if (!context) throw new Error('useFileSystem must be used in FileSystemProvider');
  return context;
}
