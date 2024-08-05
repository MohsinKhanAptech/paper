import { contextBridge, ipcRenderer } from 'electron'

if (!process.contextIsolated) {
  throw new Error('Context Isolation seems to be disabled')
}

try {
  contextBridge.exposeInMainWorld('context', {
    windowMinimize: () => {
      ipcRenderer.send('window-minimize')
    },
    windowMaximize: () => {
      ipcRenderer.send('window-maximize')
    },
    windowClose: () => {
      ipcRenderer.send('window-close')
    },
    recentDirExists: () => {
      return ipcRenderer.invoke('recentDirExists')
    },
    getCurrentDir: () => {
      return ipcRenderer.invoke('getCurrentDir')
    },
    handleDirSelect: () => {
      ipcRenderer.send('handleDirSelect')
    },
    handleDirSubmit: (dirName) => {
      ipcRenderer.send('handleDirSubmit', dirName)
    },
    mapDir: () => {
      return ipcRenderer.invoke('mapDir')
    },
    createNote: (fileName) => {
      ipcRenderer.invoke('createNote', fileName)
    },
    createDir: (dirName) => {
      ipcRenderer.invoke('createDir', dirName)
    },
    openNote: (filePath) => {
      return ipcRenderer.invoke('openNote', filePath)
    },
    saveNote: (noteData) => {
      ipcRenderer.invoke('saveNote', noteData)
    },
    git: {
      setup: () => ipcRenderer.invoke('gitSetup'),
      init: () => ipcRenderer.invoke('gitInit'),
      branch: () => ipcRenderer.invoke('gitBranch'),
      status: () => ipcRenderer.invoke('gitStatus'),
      add: () => ipcRenderer.invoke('gitAdd'),
      addRemote: (remoteURL) => ipcRenderer.invoke('gitAddRemote', remoteURL),
      listRemote: () => {
        return ipcRenderer.invoke('gitListRemote')
      },
      getRemotes: () => {
        return ipcRenderer.invoke('gitGetRemotes')
      },
      commit: () => ipcRenderer.invoke('gitCommit'),
      push: () => ipcRenderer.invoke('gitPush'),
      pull: () => ipcRenderer.invoke('gitPull'),
      sync: () => ipcRenderer.invoke('gitSync')
    }
  })
} catch (error) {
  console.log(error)
}
