import { NotionAPI } from 'notion-client'
import 'react-notion-x/src/styles.css'
import { NotionRenderer } from 'react-notion-x'

export default function Home(props) {
  return (
    <NotionRenderer recordMap={props.recordMap} fullPage={true} darkMode={false} />
  )
}

export async function getStaticProps(context) {

  const get = async () => {
      const api = new NotionAPI()

      return await api.getPage('2b84148d7fc1464b90b7bb87c1a9a2ea')
  }

  return {
    props: {
      recordMap: await get()
    }, // will be passed to the page component as props
  }
}
