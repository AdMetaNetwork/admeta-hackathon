export default function Home(props) {
  const ip = props.ip;
  return <div style={{ padding: 30 }}>
    <h1>IP Address <span style={{ color: 'blue' }}>{ip}</span></h1>
  </div>
}

export async function getServerSideProps(context) {
  let ip;

  const { req } = context;

  if (req.headers["x-forwarded-for"]) {
    ip = req.headers["x-forwarded-for"].split(',')[0]
  } else if (req.headers["x-real-ip"]) {
    ip = req.connection.remoteAddress
  } else {
    ip = req.connection.remoteAddress
  }

  console.log(ip)
  return {
    props: {
      ip,
    },
  }
}