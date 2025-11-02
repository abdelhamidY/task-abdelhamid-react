import KanbanBoard from "./components/Kanban/kanban-board/KanbanBoard";
import ReactQueryProvider from "./utils/providers/react-query/reactQuery.provider";
import ReduxProvider from "./utils/providers/redux-provider/redux.provider";
import ThemeProvider from "./utils/providers/theme-provider/theme.provider";

function App() {
  return (
    <ThemeProvider>
      <ReduxProvider>
        <ReactQueryProvider>
          <KanbanBoard />
        </ReactQueryProvider>
      </ReduxProvider>
    </ThemeProvider>
  );
}

export default App;
