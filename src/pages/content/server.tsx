import {useParams} from "react-router-dom";

export default function ServerPage() {
  const {server} = useParams()

  return (
      <>
        Server: {server}<br />
      </>
  )
};
