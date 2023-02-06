import {useParams} from "react-router-dom";

export default function WorldPlayerCurrentPage() {
  const {server, world} = useParams()

  return (
      <>
        Server: {server}<br />
        World: {world}<br />
      </>
  )
};
