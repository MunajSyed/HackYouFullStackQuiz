/*
Author: Munaj Syed
Date: Dec 16, 2018
Description: Quiz for HackerYou that requires fetching data from an api and displaying all nessecary information
*/

import React, { Component } from 'react';
import Modal from 'react-responsive-modal';

import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      token: 'MDowYWEyYzEzNi1mZDVmLTExZTgtYTVjNS1mNzkwMThkMjhjYWI6OVZrQWZRVVF4enpkRTIyTlVLRFl0cjhCa3RXQ0p1RFRxaDZJ',
      items: [],
      store: [],
      isLoaded: false,
      descriptionModal: false,
      locationModal: false,
      name: "",
      desc: "",
      taste:"",
      address: "",
      city: "",
      postalCode: "",
    }

  }
//Function used to fetch data from api
  fetchApi(url){
    return (fetch(url, {
      method: 'get',
      headers: { 'Authorization': 'Token ' + this.state.token }
    }))
  }
//Funciton to initialize the data, calling url with products for Beau that is true for seasonal
  componentDidMount() {
    this.fetchApi('https://lcboapi.com/products?q=Beau%27s%20All%20Natural&where=is_seasonal&per_page=100')
      .then((res) => res.json())
      .then((json) => {
        this.setState({
          isLoaded: true,
          items: json.result,
        })
        console.log(this.state.items);
      })
  }
//Function to save more information about beer company and save it in states
  moreInfo(desc, id, _name, tastingNote) {
    this.fetchApi('https://lcboapi.com/stores?product_id=' + id)
      .then((res) => res.json())
      .then((json) => {
        this.setState({
          isLoaded: true,
          descriptionModal: true,
          store: json.result,
          name: _name,
          desc: desc,
          taste: tastingNote,
        })
        console.log(this.state.store);
      })
  }
//Functions used to open and close modals
  onOpenDescriptionModal = () => {
    this.setState({ descriptionModal: true });
  };

  onCloseDescriptionModal = () => {
    this.setState({ descriptionModal: false });
  };

  onlocationModal = () => {
    this.setState({ locationModal: true });
  };

  onCloseLocationModal = () => {
    this.setState({ locationModal: false });
  };
//Main function used to render the GUI 
  render() {
//Declair all of the variables set in state
    var { isLoaded, items, descriptionModal, name, desc, store, locationModal, taste} = this.state;

    if (!isLoaded) {
      return <div> Loading... </div>
    }
    else {
      return (
        <div className="App">
          {items.map((d, idx) => {
            return (
              <div>
                <h2>{d.name}</h2>
                <div className="Image">
                  <img
                    src={d.image_url ? d.image_url  : "https://upload.wikimedia.org/wikipedia/commons/a/ac/No_image_available.svg"}
                    width="250"
                    height="280"
                    onClick={() => this.moreInfo(d.tags, d.product_no, d.name, d.tasting_note)}
                  />
                </div>
                <div>
                  <Modal open={descriptionModal} onClose={this.onCloseDescriptionModal} center>
                    <h2>{name}</h2>
                    <h2>{taste}</h2>
                    <h2>{desc}</h2>
                    <button className="btn btn-action" onClick={this.onlocationModal} style={{backgroundColor: "white", textColor:"green", height: 50, width: 150,fontSize: 20}}>
                      Locate Stores
                    </button>
                  </Modal>
                  <Modal open={locationModal} onClose={this.onCloseLocationModal} center>
                    {store.map((storeLocation, idx) => {
                      return (<p>{storeLocation.address_line_1 + " " +storeLocation.city + ", " + storeLocation.postal_code}</p>
                      )
                    })
                    }
                  </Modal>
                </div>

              </div>
            )
          })}
        </div>
      );
    }
  }


}

export default App;