import {useParams} from "react-router-dom";

export default function WorldConquerDailyPage() {
  const {server, world} = useParams()

  return (
      <>
        Server: {server}<br />
        World: {world}<br />
      </>
  )
};
