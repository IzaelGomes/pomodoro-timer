import {
  ReactNode,
  createContext,
  useEffect,
  useReducer,
  useState,
} from "react"
import { Cycle, cyclesReducer } from "../reducers/cycles/reducer"
import {
  addNewCycleAction,
  interruptCurrentCycleAction,
} from "../reducers/cycles/actions"
import { differenceInSeconds } from "date-fns"

interface CreateCycleData {
  task: string
  minutesAmount: number
}

interface CyclesContextType {
  cycles: Cycle[]
  activeCycle: Cycle | undefined
  activeCycleId: string | null
  amountSecondsPassed: number
  markCurrentCycleAsFinished: () => void
  setSecondsPassed: (seconds: number) => void
  createNewCycle: (data: CreateCycleData) => void
  interruptCurrentCycle: () => void
}

export const CyclesContext = createContext({} as CyclesContextType)

interface CycleContextProviderProps {
  children: ReactNode
}

const CycleContextProvider = ({ children }: CycleContextProviderProps) => {
  const [cyclesState, dispatch] = useReducer(
    cyclesReducer,
    {
      cycles: [],
      activeCycleId: null,
    },
    (initialState) => {
      const storedStateAsJson = localStorage.getItem(
        "@pomodoro-timer-cycles-state-1.0.0"
      )

      console.log(initialState)

      if (storedStateAsJson) {
        return JSON.parse(storedStateAsJson)
      }

      return {
        cycles: [],
        activeCycleId: null,
      }
    }
  )

  const { cycles, activeCycleId } = cyclesState

  console.log(activeCycleId)

  const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId)

  const [amountSecondsPassed, setAmountSecondPassed] = useState(() => {
    if (activeCycle) {
      return differenceInSeconds(new Date(), new Date(activeCycle.startDate))
    }

    return 0
  })

  useEffect(() => {
    const stateJson = JSON.stringify(cyclesState)

    localStorage.setItem("@pomodoro-timer-cycles-state-1.0.0", stateJson)
  }, [cyclesState])

  function setSecondsPassed(seconds: number) {
    setAmountSecondPassed(seconds)
  }

  function markCurrentCycleAsFinished() {
    dispatch(markCurrentCycleAsFinished)
  }

  function createNewCycle(data: CreateCycleData) {
    const newCycle: Cycle = {
      id: String(new Date().getTime()),
      task: data.task,
      minutesAmount: data.minutesAmount,
      startDate: new Date(),
    }
    dispatch(addNewCycleAction(newCycle))
  }

  function interruptCurrentCycle() {
    dispatch(interruptCurrentCycleAction())
  }

  return (
    <CyclesContext.Provider
      value={{
        cycles,
        activeCycle,
        activeCycleId,
        markCurrentCycleAsFinished,
        amountSecondsPassed,
        setSecondsPassed,
        createNewCycle,
        interruptCurrentCycle,
      }}
    >
      {children}
    </CyclesContext.Provider>
  )
}

export { CycleContextProvider }
