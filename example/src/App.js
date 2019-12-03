import React, { Component } from 'react'
import Agenda, { AgendaViewModel } from 'react-event-agenda'
import { IoMdInformationCircleOutline } from 'react-icons/io';
import { initializeIcons } from '@uifabric/icons';


export default class App extends Component {

  constructor() {
    super();
    this.agendaViewModel = new AgendaViewModel({
      "id": "f4159afc-ca9b-452b-9779-b2fb0289d5ac ",
      "days": [
        {
          "id": "49982ca2-95b7-4c5e-b0c2-bbe51465736e",
          "startTime": "2013-02-08T07:00:00.000Z",
          "endTime": "2013-02-08T16:30:00.000Z",
          "tracks": [
            {
              "id": "dba5df09-95b7-43aa-bae8-8d670a696417",
              "name": "",
              "items": [
                {
                  "id": "5331f2cf-4b0b-40fe-9d61-60221e3694f3",
                  "title": "Welcome",
                  "speaker": "Host Company",
                  "start": "2013-02-08T09:00:00.000Z",
                  "end": "2013-02-08T10:00:00.000Z"
                }
              ]
            }
          ]
        },
        {
          "id": "49982ca2-95b7-4c5e-b0c2-b65736e",
          "startTime": "2013-02-09T07:00:00.000Z",
          "endTime": "2013-02-09T16:30:00.000Z",
          "tracks": [
            {
              "id": "dba5df09-95b7-43aa-0a696417",
              "name": "",
              "items": [
                {
                  "id": "5331f2cf-4b0b-40fe-9d61-61e3694f3",
                  "title": "Welcome",
                  "speaker": "Host Company",
                  "start": "2013-02-09T09:00:00.000Z",
                  "end": "2013-02-09T10:00:00.000Z"
                }
              ]
            }
          ]
        },
        {
          "id": "49982ca2-95b7--b0c2-b65736e",
          "startTime": "2013-02-10T07:00:00.000Z",
          "endTime": "2013-02-10T16:30:00.000Z",
          "tracks": [
            {
              "id": "dba5df09-95b7--0a696417",
              "name": "",
              "items": [
                {
                  "id": "5331f2cf-4b0b--9d61-61e3694f3",
                  "title": "Welcome",
                  "speaker": "Host Company",
                  "start": "2013-02-10T09:00:00.000Z",
                  "end": "2013-02-10T10:00:00.000Z"
                }
              ]
            }
          ]
        },
        {
          "id": "49982ca2---b0c2-b65736e",
          "startTime": "2013-02-11T07:00:00.000Z",
          "endTime": "2013-02-11T16:30:00.000Z",
          "tracks": [
            {
              "id": "dba5df09--0a696417",
              "name": "",
              "items": [
                {
                  "id": "5331f2cf-4b0b--61e3694f3",
                  "title": "Welcome",
                  "speaker": "Host Company",
                  "start": "2013-02-11T09:00:00.000Z",
                  "end": "2013-02-11T10:00:00.000Z"
                }
              ]
            }
          ]
        },
        {
          "id": "49982ca2--b65736e",
          "startTime": "2013-02-12T07:00:00.000Z",
          "endTime": "2013-02-12T16:30:00.000Z",
          "tracks": [
            {
              "id": "dba5df09-",
              "name": "",
              "items": [
                {
                  "id": "5331f2cf--61e3694f3",
                  "title": "Welcome",
                  "speaker": "Host Company",
                  "start": "2013-02-12T09:00:00.000Z",
                  "end": "2013-02-12T10:00:00.000Z"
                }
              ]
            }
          ]
        }
      ]
    });
    initializeIcons();
  }

  customItemActions = [
    {
      iconName: 'info',
      iconToRender: <IoMdInformationCircleOutline size={'1.2em'} />,
      action: (item) => console.log(item.uiState, item.id, item.start.format('DD.MM.YYYY HH:mm'), item.end.format('DD.MM.YYYY HH:mm')),
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
        />
      </div>
    )
  }
}
