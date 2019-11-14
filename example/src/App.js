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
