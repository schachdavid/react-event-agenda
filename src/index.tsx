/**
 * @class ExampleComponent
 */

import * as React from 'react'
import Agenda from './components/main/Agenda/Agenda';
import AgendaViewModel from './AgendaViewModel';
import {getPalette} from './theme';




// TODO: to be replaced, icons should be passed via props
import { initializeIcons } from 'office-ui-fabric-react/lib/Icons';

initializeIcons();

// TODO: use primary color from props
import { loadTheme } from 'office-ui-fabric-react';



loadTheme({
  palette: getPalette()
});


export default class ExampleComponent extends React.Component {

  render() {


    const agendaViewModel = new AgendaViewModel();


    return (
        <Agenda agendaViewModel={agendaViewModel}></Agenda>
    )
  }
}




