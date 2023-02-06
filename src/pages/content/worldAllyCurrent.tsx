import {useParams} from "react-router-dom";

export default function WorldAllyCurrentPage() {
  const {server, world} = useParams()

  return (
      <>
        Server: {server}<br />
        World: {world}<br />
      </>
  )
};
