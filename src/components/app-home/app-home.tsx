import { Component, h } from '@stencil/core';
import data from './content.js'

@Component({
  tag: 'app-home',
  styleUrl: 'app-home.css',
})

export class AppHome {

  introtext() {
    return <div>
      <p>Med Kunstlandskap Gudbrandsdalen blir du kjent med Gudbrandsdalen på en helt ny måte, der fortid, nåtid og fremtid er del av fortellingen.</p>
      <p>Kunstverkene ligger på rekke og rad, både geografisk og i tid, og utgjør en veiviser til bortgjemte naturperler, historie og moderne utvikling.</p>
      <p>Ser du nøye etter, kan kunstverkene åpne for tilfeldige oppdagelser av forhistorien til stedene der vi lever og ferdes i dag.</p>
    </div>
  }

  outrotext() {
    return <div><p>Fylkekommunale kunstprosjekter som Tankeplass og Vegskille, samt Sparebankstiftelsens prosjekt Skulpturstopp, er bakgrunn for mange av kunstverkene som i dag kan oppleves på reise gjennom Gudbrandsdalen. Du finner mer info om disse prosjektene her:</p><p><a href="https://kulturnett.oppland.org/tankeplass/">Tankeplass</a> | <a href="https://www.skulpturstopp.no/">Skulpturstopp</a></p></div>
  }

  content() {
    return JSON.parse(data)
  }

  render() {
    
      return <div>

      <kg-background></kg-background>

      <kg-logo></kg-logo>
      <main class="main">
        <kg-intro introtext={this.introtext()} />
        <div class="card-container">
          { Object.entries(this.content()).map(data => (
            <kg-card artworktitle={data[1]['title']} name={data[1]['name']} maplink={data[1]['maplink']} description={data[1]['description']} directions={data[1]['directions']} images={data[1]['images']} />
          )) }
          <kg-intro introtext={this.outrotext()} />
        </div>
        
      </main>
      
      <kg-footer></kg-footer>

    </div>
    
  }
}
