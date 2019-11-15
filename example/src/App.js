import React, { Component } from 'react'
import Agenda, { AgendaViewModel } from 'react-event-agenda'


export default class App extends Component {

  constructor() {
    super();
    this.agendaViewModel = new AgendaViewModel();
  }

  customItemActions = [
    {
      iconName: 'info',
      action: (item) => console.log(item.id, item.start.format('DD.MM.YYYY HH:mm'), item.end.format('DD.MM.YYYY HH:mm')),
    }
  ]

  colorPalette = {
    themePrimary: '#29b59a',
    themeLighterAlt: '#020706',
    themeLighter: '#061d19',
    themeLight: '#0c362e',
    themeTertiary: '#186c5d',
    themeSecondary: '#249f88',
    themeDarkAlt: '#39bca3',
    themeDark: '#51c7b0',
    themeDarker: '#79d5c4',
    neutralLighterAlt: '#082a35',
    neutralLighter: '#0c313d',
    neutralLight: '#123c4b',
    neutralQuaternaryAlt: '#174453',
    neutralQuaternary: '#1c4a5a',
    neutralTertiaryAlt: '#326476',
    neutralTertiary: '#c8c8c8',
    neutralSecondary: '#d0d0d0',
    neutralPrimaryAlt: '#dadada',
    neutralPrimary: '#ffffff',
    neutralDark: '#f4f4f4',
    black: '#f8f8f8',
    white: '#05222c',
  };


  

  render() {
    return (
      <div style={{ height: '100vh', width: '100vw', maxWidth: '100%' }}>
        <Agenda
          agendaViewModel={this.agendaViewModel}
          customItemActions={this.customItemActions}
        />
      </div>
    )
  }
}
