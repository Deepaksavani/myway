import React, { Component } from "react";
import "../styles/custom.css";
import { Button, Modal, ModalBody, UncontrolledTooltip } from "reactstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import GoogleMapReact from "google-map-react";
import Headers from "../component/header";
import SideMenu from "../component/sidemenu";
import Truck from "./../assets/img/truck.png";
import Ship from "./../assets/img/ship.png";
import ShipBig from "./../assets/img/ship-big.png";
import ShipWhite from "./../assets/img/ship-white.png";
import Booked from "./../assets/img/booked.png";
import Departed from "./../assets/img/departed.png";
import Arrived from "./../assets/img/arrived.png";
import Inland from "./../assets/img/inland.png";
import Delivery from "./../assets/img/delivery.png";
import Edit from "./../assets/img/pencil.png";
import Delete from "./../assets/img/red-delete-icon.png";
import Download from "./../assets/img/csv.png";

const SourceIcon = () => (
  <div className="map-circ source-circ" id="source-circ">
    <UncontrolledTooltip show placement="right" target="source-circ">
      Istanbul
    </UncontrolledTooltip>
  </div>
);
const DestiIcon = () => (
  <div className="map-circ desti-circ" id="desti-circ">
    <UncontrolledTooltip show placement="right" target="desti-circ">
      New York
    </UncontrolledTooltip>
  </div>
);

class ShipmentPlanner extends Component {
  constructor(props) {
    super(props);

    this.state = {
      modalTransit: false,
      modalEdit: false,
      startDate: new Date()
    };

    this.toggleTransit = this.toggleTransit.bind(this);
    this.toggleEdit = this.toggleEdit.bind(this);
  }

  static defaultProps = {
    center: {
      lat: 59.95,
      lng: 30.33
    },
    zoom: 11
  };

  handleChange = date => {
    this.setState({
      startDate: date
    });
  };

  toggleTransit() {
    this.setState(prevState => ({
      modalTransit: !prevState.modalTransit
    }));
  }
  toggleEdit() {
    this.setState(prevState => ({
      modalEdit: !prevState.modalEdit
    }));
  }

  render() {
    return (
      <div>
        <Headers />
        <div className="cls-ofl">
          <div className="cls-flside">
            <SideMenu />
          </div>
          <div className="cls-rt">
            <div className="container-fluid">
              <div className="row">
                <div className="col-md-5 pl-0">
                  <div className="title-sect title-border">
                    <h2>My Suppliers</h2>
                  </div>
                  <div className="planner-cntr">
                    <div className="login-input-cntr">
                      <div className="login-fields">
                        <label>Select Company</label>
                        <select>
                          <option>
                            BLUEGROUND TURIZM VE SERVIS HIZMETLERI TICARET A.S.
                            (Istanbul)
                          </option>
                          <option>
                            BLUEGROUND TURIZM VE SERVIS HIZMETLERI TICARET A.S.
                            (Istanbul)
                          </option>
                          <option>
                            BLUEGROUND TURIZM VE SERVIS HIZMETLERI TICARET A.S.
                            (Istanbul)
                          </option>
                        </select>
                      </div>
                      <div className="login-fields">
                        <label>Select Company</label>
                        <select>
                          <option>BLUEGROUND US INC (New York)</option>
                          <option>BLUEGROUND US INC (New York)</option>
                          <option>BLUEGROUND US INC (New York)</option>
                        </select>
                      </div>
                      <div className="login-fields">
                        <label>Select Mode</label>
                        <select>
                          <option>SEA Consolidation</option>
                          <option>SEA Consolidation</option>
                          <option>SEA Consolidation</option>
                        </select>
                      </div>
                      <div className="login-fields">
                        <label>Select Liner</label>
                        <select>
                          <option>MSC (Primary)</option>
                          <option>MSC (Primary)</option>
                          <option>MSC (Primary)</option>
                        </select>
                      </div>
                      <div className="login-fields">
                        <label>Select Date</label>
                        <DatePicker
                          selected={this.state.startDate}
                          onChange={this.handleChange}
                        />
                      </div>
                    </div>
                    <div className="text-right">
                      <button className="butn">Submit</button>
                    </div>
                  </div>
                </div>
                <div className="col-md-7">
                  <div className="planner-top-butns">
                    <button className="butn cancel-butn">Delivery Date</button>
                    <button className="butn cancel-butn">Visual Summary</button>
                    <button
                      onClick={this.toggleTransit}
                      className="butn cancel-butn"
                    >
                      Transit Time
                    </button>
                  </div>
                  <div className="full-map-cntr">
                    <div className="ship-detail-maps full-map mt-0">
                      <div className="ship-detail-map">
                        <GoogleMapReact
                          bootstrapURLKeys={{
                            key: "AIzaSyAdUg5RYhac4wW-xnx-p0PrmKogycWz9pI"
                          }}
                          defaultCenter={this.props.center}
                          defaultZoom={this.props.zoom}
                        >
                          <SourceIcon lat={59.955413} lng={30.337844} />
                          <DestiIcon lat={59.9} lng={30.3} />
                        </GoogleMapReact>
                      </div>
                    </div>
                  </div>
                </div>
                <Modal
                  className="transit-popup"
                  isOpen={this.state.modalTransit}
                  toggle={this.toggleTransit}
                  centered={true}
                >
                  <ModalBody className="p-0">
                    <div className="container-fluid p-0">
                      <div className="transit-sect">
                        <div className="row">
                          <div class="col-md-4 details-border">
                            <div>
                              <p class="details-title">Total Average Days</p>
                              <p class="details-para">37</p>
                            </div>
                          </div>
                          <div class="col-md-4 details-border">
                            <div>
                              <p class="details-title">Total Minimum Days</p>
                              <p class="details-para">34</p>
                            </div>
                          </div>
                          <div class="col-md-4 details-border">
                            <div>
                              <p class="details-title">Total Maximum Days</p>
                              <p class="details-para">44</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="transit-sect-overflow">
                        <div className="transit-sect">
                          <div className="d-flex justify-content-between align-items-center">
                            <div className="d-flex align-items-center">
                              <div className="shipment-img mr-3">
                                <img src={Truck} alt="truck icon" />
                              </div>
                              <div>
                                <p className="desti-name">Istanbul</p>
                                <p className="desti-route">
                                  to Istanbul, Istanbul, Turkey
                                </p>
                              </div>
                            </div>
                            <button className="butn cancel-butn">View</button>
                          </div>
                          <div className="row">
                            <div className="col-md-4">
                              <div className="days-cntr">
                                <p className="days-title">Average Days</p>
                                <span className="days-count">1</span>
                              </div>
                            </div>
                            <div className="col-md-4">
                              <div className="days-cntr">
                                <p className="days-title">Minimum Days</p>
                                <span className="days-count">1</span>
                              </div>
                            </div>
                            <div className="col-md-4">
                              <div className="days-cntr">
                                <p className="days-title">Maximum Days</p>
                                <span className="days-count">2</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="transit-sect">
                          <div className="d-flex justify-content-between align-items-center">
                            <div className="d-flex align-items-center">
                              <div className="shipment-img mr-3">
                                <img src={Ship} alt="ship icon" />
                              </div>
                              <div>
                                <p className="desti-name">
                                  Istanbul, Istanbul, Turkey
                                </p>
                                <p className="desti-route">
                                  to Sines, Setúbal, Portugal
                                </p>
                              </div>
                            </div>
                            <button className="butn cancel-butn">View</button>
                          </div>
                          <div className="row">
                            <div className="col-md-4">
                              <div className="days-cntr">
                                <p className="days-title">Average Days</p>
                                <span className="days-count">24</span>
                              </div>
                            </div>
                            <div className="col-md-4">
                              <div className="days-cntr">
                                <p className="days-title">Minimum Days</p>
                                <span className="days-count">22</span>
                              </div>
                            </div>
                            <div className="col-md-4">
                              <div className="days-cntr">
                                <p className="days-title">Maximum Days</p>
                                <span className="days-count">26</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="transit-sect">
                          <div className="d-flex justify-content-between align-items-center">
                            <div className="d-flex align-items-center">
                              <div className="shipment-img mr-3">
                                <img src={Ship} alt="ship icon" />
                              </div>
                              <div>
                                <p className="desti-name">
                                  Sines, Setúbal, Portugal
                                </p>
                                <p className="desti-route">
                                  to Baltimore, Maryland, United States
                                </p>
                              </div>
                            </div>
                            <button className="butn cancel-butn">View</button>
                          </div>
                          <div className="row">
                            <div className="col-md-4">
                              <div className="days-cntr">
                                <p className="days-title">Average Days</p>
                                <span className="days-count">11</span>
                              </div>
                            </div>
                            <div className="col-md-4">
                              <div className="days-cntr">
                                <p className="days-title">Minimum Days</p>
                                <span className="days-count">10</span>
                              </div>
                            </div>
                            <div className="col-md-4">
                              <div className="days-cntr">
                                <p className="days-title">Maximum Days</p>
                                <span className="days-count">14</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="transit-sect">
                          <div className="d-flex justify-content-between align-items-center">
                            <div className="d-flex align-items-center">
                              <div className="shipment-img mr-3">
                                <img src={Truck} alt="truck icon" />
                              </div>
                              <div>
                                <p className="desti-name">
                                  Baltimore, Maryland, United States
                                </p>
                                <p className="desti-route">to New York</p>
                              </div>
                            </div>
                            <button className="butn cancel-butn">View</button>
                          </div>
                          <div className="row">
                            <div className="col-md-4">
                              <div className="days-cntr">
                                <p className="days-title">Average Days</p>
                                <span className="days-count">1</span>
                              </div>
                            </div>
                            <div className="col-md-4">
                              <div className="days-cntr">
                                <p className="days-title">Minimum Days</p>
                                <span className="days-count">1</span>
                              </div>
                            </div>
                            <div className="col-md-4">
                              <div className="days-cntr">
                                <p className="days-title">Maximum Days</p>
                                <span className="days-count">2</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </ModalBody>
                </Modal>
                {/* <Modal
                  className="delete-popup"
                  isOpen={this.state.modalEdit}
                  toggle={this.toggleEdit}
                  centered={true}
                >
                  <ModalBody>
                    <div className="rename-cntr login-fields">
                      <label>Rename your document</label>
                      <input type="text" placeholder="Rename here..." />
                    </div>
                    <Button className="butn" onClick={this.toggleEdit}>
                      Done
                    </Button>
                    <Button
                      className="butn cancel-butn"
                      onClick={this.toggleEdit}
                    >
                      Cancel
                    </Button>
                  </ModalBody>
                </Modal> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ShipmentPlanner;