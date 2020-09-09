import React from 'react';

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      hasAddPrivilage: false,
      isDropDownOpen: false,
      isDropDownExpanded: false,
      selected: 'Select a location...',
      search: '',
      country: [],
      fetchedCountries: [],
      maxIteminList: 5,
      debounceTimer: null
    }
  }

  UNSAFE_componentWillMount() {
    fetch("https://api.first.org/data/v1/countries").then((response) => {
      response.json().then((result) => {
        this.setState({
          country: Object.values(result.data).map((country) => country.country),
          fetchedCountries: Object.values(result.data).map((country) => country.country)
        });
      })
    }).catch((err) => {
      console.log("Failed to fetch");
    })
  }

  toggleAddPrivilage = () => {
    this.setState({
      hasAddPrivilage: !this.state.hasAddPrivilage
    });
  }

  toggleDropDown = () => {
    this.setState({
      isDropDownOpen: !this.state.isDropDownOpen,
      isDropDownExpanded: false
    });
  }

  toggleDropDownExpanded = () => {
    this.setState({
      isDropDownExpanded: !this.state.isDropDownExpanded
    })
  }

  updateSeleted = (country) => {
    this.setState({
      isDropDownOpen: false,
      selected: country
    });
  }

  searchCountry = (input) => {
    if (this.debounceTimer !== null) {
      clearTimeout(this.debounceTimer);
    }
    this.debounceTimer = setTimeout(() => {
      this.setState({
        search: input,
        country: input === '' ? this.state.fetchedCountries : this.state.fetchedCountries.filter((country) => country.toLowerCase().indexOf(input.toLowerCase()) > -1)
      })
    }, 1000)
  }

  addAndSelect = () => {
    let countries = this.state.fetchedCountries;
    countries.push(this.state.search);
    this.setState({
      isDropDownOpen: false,
      selected: this.state.search,
      country: countries,
      fetchedCountries: countries
    })
  }

  render() {
    return (
      <div className="project-holder">
        <h1>Smart Drop down with React JS</h1>
        <p align="justify">The parent is responsible for passing the Array of countries. The child should iterate and display the
          list of countries received. The max no. of items listed in the dropdown should be configureable from
          the parent. Upon user selecting the country, the parent should log the selected the country.</p>
        <ul>
          <li>If the user with Add privilege, then if the location user searching is not part of the list, then possible to add</li>
          <li>If user, dont have privilege to Add, dont display the "Add & Select" button.</li>
          <li>If user click on "X more...", then the complete list of countries would be displayed.</li>
          <li>Debounce to control user input</li>
        </ul>
        <div className="row">
          {
            this.state.hasAddPrivilage ? <button className="button" onClick={this.toggleAddPrivilage}>Remove Add Privilage</button> : <button className="button"  onClick={this.toggleAddPrivilage}>Provide Add Privilage</button>
          }
        </div>
        <div className="component-holder row">
          <div className={this.state.isDropDownOpen ? "select-holder active" : "select-holder"} onClick={this.toggleDropDown}>{this.state.selected}</div>
          {
            this.state.isDropDownOpen &&
            (
              (
                <div className={this.state.isDropDownExpanded ? "dropdown-content expanded" : "dropdown-content"}>
                  <input type="text" placeholder="Search..." className="search-input" onChange={(e) => this.searchCountry(e.target.value)} />
                  {
                    this.state.country.length > 0 ? (
                      this.state.isDropDownExpanded ? 
                      this.state.country.map((country, index) => {
                        return(
                          <div className="list-item" key={index} onClick={() => {this.updateSeleted(country)}}>
                            {country}
                          </div>
                        );
                      }) :
                      this.state.country.slice(0, this.state.maxIteminList).map((country, index) => {
                        return(
                          <div className="list-item" key={index} onClick={() => {this.updateSeleted(country)}}>
                            {country}
                          </div>
                        );
                      })
                    ) : (
                      <div className="dropdown-content">
                        <div className="list-item">
                          {
                            this.state.search === '' ? 'Failed to fetch countries' : `${this.state.search} not found`
                          }
                          {
                            this.state.hasAddPrivilage && <button className="button button-outline float-right add-button" onClick={this.addAndSelect}>Add & Select</button>
                          }
                        </div>
                      </div>
                    )
                  }
                  {
                    this.state.country.length > this.state.maxIteminList && this.state.isDropDownExpanded === false && <span className="more-chip" onClick={this.toggleDropDownExpanded}>{this.state.country.length - this.state.maxIteminList} more ...</span>
                  }
                </div>
              )
            )
          }
        </div>
      </div>
    );
  }
}

export default App;
