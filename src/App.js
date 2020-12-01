import React, { useEffect, useState } from 'react'
import './App.css';

function App() {
  const [vpnList, setVpnList] = useState([])
  const [selectedVpn, setSelectedVpn] = useState()
  const [routerLocation, setRouterLocation] = useState(window.location.hostname)

  const api = `http://${routerLocation}:8000`

  const fetchVpnList = () => {
    setSelectedVpn(null)
    fetch(`${api}/vpn/list`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    })
        .then((response) => response.json())
        .then((response) => setVpnList(response?.vpns))
        .catch((err) => alert('WTF: ' + err))
  }

  const sendSelectedVpn = () => {
    fetch(`${api}/vpn/set`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ vpn: selectedVpn })
    }).then((response) => {
      if (!response.ok) alert(`${response.status}: ${response.statusText}`)
      else alert(`${response.status}: ${response.statusText} (patience ça tourne)`)
    })
  }

  useEffect(() => {
    fetchVpnList()
  }, [])

  return (
    <div className="App">
      <div className="wrapper">
        <p>Usual Ip:</p>
        <p>192.168.1.17</p>
        <p>Si il y a une erreur à l'initialisation (tu reconnaitras) avec cette configuration: 192.168.1.17. Contacte l'administrateur système (c'est boggie)</p>
        <label>
          Ou est mon routeur:
          <input type="text" value={routerLocation} onChange={(e) => setRouterLocation(e.target.value)}/>
        </label>
      </div>
      <div className="wrapper">
        <div className="maxWidth">
          <select value={selectedVpn || undefined} onChange={e => setSelectedVpn(e.target.value)}>
            {vpnList.map(({label, value}, index) => (
                <option key={`${value}-${index}`} value={value}>{label}</option>
            ))}
          </select>
          <button className="button" onClick={fetchVpnList}>Rafraîchir la liste</button>
          <button className="button" onClick={() => selectedVpn && sendSelectedVpn()}>Envoyer</button>
        </div>
      </div>
    </div>
  );
}

export default App;
