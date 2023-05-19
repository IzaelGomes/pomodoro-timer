import { HandPalm, Play } from "phosphor-react"
import { useContext } from "react"
import {
  HomeContainer,
  StartCountdownButton,
  StopStartCountdownButton,
} from "./styles"
import { NewCycleForm } from "./components/NewCycleForm"
import { CountDown } from "./components/CountDown"
import { zodResolver } from "@hookform/resolvers/zod"
import { FormProvider, useForm } from "react-hook-form"
import * as zod from "zod"
import { CyclesContext } from "../../contexts/CycleContext"

const newCycleFormValidationSchema = zod.object({
  task: zod.string().min(1, "informe a tarefa"),
  minutesAmount: zod.number().min(1).max(60),
})

type NewCycleFormData = zod.infer<typeof newCycleFormValidationSchema>

const Home = () => {
  const { activeCycle, createNewCycle, interruptCurrentCycle } =
    useContext(CyclesContext)

  const newCycleForm = useForm<NewCycleFormData>({
    resolver: zodResolver(newCycleFormValidationSchema),
    defaultValues: {
      task: "",
      minutesAmount: 0,
    },
  })

  const { handleSubmit, watch, reset } = newCycleForm

  function handleCreatenewCycle(data: NewCycleFormData) {
    createNewCycle(data)

    reset()
  }

  const task = watch("task")

  const isSubmitDisabled = !task

  return (
    <HomeContainer>
      <form onSubmit={handleSubmit(handleCreatenewCycle)}>
        <FormProvider {...newCycleForm}>
          <NewCycleForm />
        </FormProvider>

        <CountDown />

        {activeCycle ? (
          <StopStartCountdownButton
            onClick={interruptCurrentCycle}
            type="button"
          >
            <HandPalm size={24} />
            Interromper
          </StopStartCountdownButton>
        ) : (
          <StartCountdownButton disabled={isSubmitDisabled} type="submit">
            <Play size={24} />
            Começar
          </StartCountdownButton>
        )}
      </form>
    </HomeContainer>
  )
}

export { Home }
