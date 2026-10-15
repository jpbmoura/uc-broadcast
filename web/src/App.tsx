import Button from '@mui/material/Button'

const App = () => (
  <div className="flex min-h-screen items-center justify-center gap-4">
    <Button variant="contained">MUI</Button>
    <Button variant="outlined" className="rounded-full px-8">
      MUI + Tailwind
    </Button>
  </div>
)

export default App
