import { Component, h } from '@stencil/core';

@Component({
  tag: 'app-home',
  styleUrl: 'app-home.css',
})

export class AppHome {

  images() {
    return [
      "/assets/images/NHTBL-holdingpage1.jpg",
      "/assets/images/NHTBL-holdingpage2.jpg",
      "/assets/images/NHTBL-holdingpage3.jpg",
      "/assets/images/NHTBL-holdingpage4.jpg",
      "/assets/images/NHTBL-holdingpage5.jpg",
      "/assets/images/NHTBL-holdingpage6.jpg",
      "/assets/images/NHTBL-holdingpage7.jpg",
      "/assets/images/NHTBL-holdingpage8.jpg",
      "/assets/images/NHTBL-holdingpage9.jpg",
      "/assets/images/NHTBL-holdingpage10.jpg"
    ]
  }

  private slideOpts = {
    initialSlide: 0,
    speed: 400,
  }

  render() {
    
      return <div>

      <nhtbl-logo></nhtbl-logo>
      <main class="main">
        <header class="main-header">
          <h1 class="font-lab-mono uppercase">NOT HERE TO BE LIKED</h1>
          <h1 class="font-lab-mono uppercase">NOT HERE TO BE LIKED</h1>
          <h1 class="font-lab-mono uppercase">NOT HERE TO BE LIKED</h1>
          <h1 class="font-lab-mono uppercase">NOT HERE TO BE LIKED</h1>
          <h1 class="font-lab-mono uppercase">NOT HERE TO BE LIKED</h1>
          <h1 class="font-lab-mono uppercase">NOT HERE TO BE LIKED</h1>
          <h1 class="font-lab-mono uppercase">NOT HERE TO BE LIKED</h1>
        </header>
        <div class="images">
          <ion-slides pager={true} options={this.slideOpts}>
            {this.images()?.map(image => (
              <ion-slide>
                  <img src={image} alt="Not here to be liked project image" />
              </ion-slide>
            )) }
          </ion-slides>
        </div>
        <div class="about font-lab-mono mt-10">
          We design for life and concoct strategies for the revolution. <a href="mailto:love@notheretobeliked.studio">Email us for advice</a>
          <br /><br />👆 Swipe for more images.
        </div>

      </main>

    </div>
    
  }
}
