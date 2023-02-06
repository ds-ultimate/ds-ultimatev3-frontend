import {useParams} from "react-router-dom";

export default function WorldAllyHistoryPage() {
  const {server, world} = useParams()

  return (
      <>
        Server: {server}<br />
        World: {world}<br />
      </>
  )
};
