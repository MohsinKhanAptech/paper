import { useEffect, useState } from 'react'
import DirSelect from './components/DirSelect'
import Sidebar from './components/Sidebar'
import NotesExplorer from './components/NotesExplorer'
import Titlebar from './components/Titlebar'
import DirCreate from './components/DirCreate'
import NoteCreate from './components/NoteCreate'
import GitMenu from './components/GitMenu'
import GitAddRemote from './components/GitAddRemote'
import SidebarMenu from './components/SidebarMenu'
import TodoSideabrMenu from './components/TodoSidebarMenu'
import TodoCreate from './components/TodoCreate'
import MainWindowContainer from './components/MainWindowContainer'
import NoteEditor from './components/NoteEditor'
import TodoEditorContainer from './components/TodoEditorContainer'

function App(): JSX.Element {
  const [hideDirSelect, updateHideDirSelect] = useState()
  const [hideSidebarMenu, updateHideHideSidebarMenu] = useState(false)
  const [hideNotesExplorer, updateHideNotesExplorer] = useState(false)
  const [hideDirCreate, updateHideDirCreate] = useState(true)
  const [hideNoteCreate, updateHideNoteCreate] = useState(true)
  const [currentNotePath, updateCurrentNotePath] = useState('')
  const [hideTodoSidebarMenu, updateHideTodoSidebarMenu] = useState(true)
  const [hideTodoCreate, updateHideTodoCreate] = useState(true)
  const [currentTodoPath, updateCurrentTodoPath] = useState('')
  const [hideGitMenu, updateHideGitMenu] = useState(true)
  const [hideAddRemoteMenu, updateHideAddRemoteMenu] = useState(true)
  const [remoteURL, updateRemoteURL] = useState('')

  const [hideNoteEditor, updateHideNoteEditor] = useState(true)
  const [hideTodoEditor, updateHideTodoEditor] = useState(true)

  const checkRecentDir = (): void => {
    window.context.recentDirExists().then((result) => {
      updateHideDirSelect(result)
    })
  }

  const getRemotes = (): void => {
    window.context.git
      .getRemotes()
      .then((result: Array<{ name: string; refs: { feth: string; push: string } }>) => {
        if (result.length !== 0) {
          result.forEach((remote) => {
            if (remote.name === 'origin') {
              updateRemoteURL(remote.refs.push)
            }
          })
        }
      })
  }

  const handleEditor = (editor): void => {
    switch (editor) {
      case 'noteEditor':
        updateHideNoteEditor(false)
        updateHideTodoEditor(true)
        break
      case 'todoEditor':
        updateHideTodoEditor(false)
        updateHideNoteEditor(true)
        break
    }
  }

  useEffect(() => {
    checkRecentDir()
    window.context.git.setup()
    getRemotes()
    const getRemotesInterval = setInterval(() => {
      getRemotes()
    }, 2500)
    setTimeout(() => {
      clearInterval(getRemotesInterval)
    }, 10000)
  }, [])

  return (
    <div className="flex flex-col h-full">
      <Titlebar />
      {hideDirSelect ? null : <DirSelect updateHideDirSelect={updateHideDirSelect} />}
      {hideDirCreate ? null : <DirCreate updateHideDirCreate={updateHideDirCreate} />}
      {hideNoteCreate ? null : <NoteCreate updateHideNoteCreate={updateHideNoteCreate} />}
      {hideTodoCreate ? null : <TodoCreate updateHideTodoCreate={updateHideTodoCreate} />}
      {hideAddRemoteMenu ? null : (
        <GitAddRemote
          updateHideAddRemoteMenu={updateHideAddRemoteMenu}
          updateRemoteURL={updateRemoteURL}
        />
      )}
      <div className="flex flex-grow h-[calc(100vh-2.5rem)]">
        <Sidebar
          className="flex-shrink-0"
          hideDirSelect={hideDirSelect}
          updateHideDirSelect={updateHideDirSelect}
          hideSidebarMenu={hideSidebarMenu}
          updateHideSidebarMenu={updateHideHideSidebarMenu}
          hideNotesExplorer={hideNotesExplorer}
          updateHideNotesExplorer={updateHideNotesExplorer}
          hideTodoSidebarMenu={hideTodoSidebarMenu}
          updateHideTodoSidebarMenu={updateHideTodoSidebarMenu}
          hideGitMenu={hideGitMenu}
          updateHideGitMenu={updateHideGitMenu}
          hideAddRemoteMenu={hideAddRemoteMenu}
          updateHideAddRemoteMenu={updateHideAddRemoteMenu}
          remoteURL={remoteURL}
          updateRemoteURL={updateRemoteURL}
        />
        {hideSidebarMenu ? null : (
          <SidebarMenu>
            {hideNotesExplorer && hideDirSelect ? null : (
              <NotesExplorer
                currentNotePath={currentNotePath}
                updateHideDirCreate={updateHideDirCreate}
                updateHideNoteCreate={updateHideNoteCreate}
                updateCurrentNotePath={updateCurrentNotePath}
                handleEditor={handleEditor}
              />
            )}
            {hideTodoSidebarMenu ? null : (
              <TodoSideabrMenu
                currentTodoPath={currentTodoPath}
                updateHideTodoCreate={updateHideTodoCreate}
                updateCurrentTodoPath={updateCurrentTodoPath}
                handleEditor={handleEditor}
              />
            )}
            {hideGitMenu ? null : <GitMenu />}
          </SidebarMenu>
        )}
        <MainWindowContainer>
          {hideNoteEditor ? null : (
            <NoteEditor key={currentNotePath} currentNotePath={currentNotePath}></NoteEditor>
          )}
          {hideTodoEditor ? null : (
            <TodoEditorContainer key={currentTodoPath} currentTodoPath={currentTodoPath} />
          )}
          {hideNoteEditor && hideTodoEditor ? (
            <div className="flex flex-col items-center justify-center w-full h-full gap-2">
              <h2 className="text-5xl">Welcome!</h2>
              <div className="">Please Select a File to Continue</div>
            </div>
          ) : null}
        </MainWindowContainer>
      </div>
    </div>
  )
}

export default App
