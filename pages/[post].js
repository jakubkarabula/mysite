import { NotionAPI } from 'notion-client'
import 'react-notion-x/src/styles.css'
import { NotionRenderer } from 'react-notion-x'

export default function Home(props) {
  console.log(props)
  return (
    <NotionRenderer recordMap={props.recordMap} fullPage={true} darkMode={false} />
  )
}

export async function getStaticProps(context) {

  const get = async () => {
      const api = new NotionAPI()

      return await api.getPage(context.params.post)
  }

  return {
    props: {
      recordMap: await get()
    }, // will be passed to the page component as props
  }
}

export async function getStaticPaths({ params }) {
  const ids = [
    '2b84148d7fc1464b90b7bb87c1a9a2ea', // index
    'e0b7bffb41bc4716ba7510bb2d9accf3', 
    '15331f3aad9145cabaa4f573f94311de'
  ]

  const paths = ids.map(post => ({ params: { post } }))

  return {
    paths,
    fallback: false
  }
}
