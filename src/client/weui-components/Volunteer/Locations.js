import React from 'react';
import { NavLink } from 'react-router-dom';
import {Badge,Panel,PanelBody,SearchBar,MediaBox,MediaBoxHeader,
    MediaBoxBody,MediaBoxTitle,MediaBoxDescription,MediaBoxInfo,
    MediaBoxInfoMeta, PanelHeader , Page   } from 'react-weui';

class Locations extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            locations: [],
        }
    }

    componentDidMount() {
        fetch(
            '/db/locations',
            {
                method: 'get'
            }
        ).then(this.parseJson)
         .then(json => {
             this.setState({ locations: json });
         })
    }

    parseJson(response) {
        return response.json();
    }


    render() {
        const locationsComponent = this.state.locations.map( location => (
            <Location locationsPath={this.props.match.path}
              key={'location-'+ location[0]}
              location_id = {location[0]}
              location_name = {location[1]}
              //district_name = {location[2]}
              district_name = '所在区'
              officetime = {`${location[2]} - ${location[3]}`}
              // officetime = {`${location[2]}`}
              //specific_position = {location[5]}
              specific_position = {location[4]}
              available = {location[5]}
              img = {location[6]}
            />
        ))

        return (
                <Page className="searchbar" title="SearchBar" subTitle="搜索栏">
                    <SearchBar
                        placeholder="请输入采血点"
                        lang={{
                            cancel: '取消'
                        }}
                    />
                    <Panel style={{marginTop: 0}}>
                        <PanelHeader>
                            采血点列表-选择采血点
                        </PanelHeader>
                        <PanelBody>
                            {locationsComponent}
                        </PanelBody>
                    </Panel>
                </Page>
        );
    }
}


class Location extends React.Component {


    render() {
        return (
            <NavLink to={`${this.props.locationsPath}/${this.props.location_id}`}>
                <MediaBox type="appmsg" href="javascript:void(0);">
                        <MediaBoxHeader style={{position: 'relative', marginRight: '30px'}}>
                            <img src={this.props.img} style={{width: '70px',height: '70px', display: 'block'}}/>
                        </MediaBoxHeader>
                        <MediaBoxBody>
                            <MediaBoxTitle>
                                {this.props.location_name}
                                <Badge preset="body">{this.props.available}</Badge>
                            </MediaBoxTitle>
                            <MediaBoxDescription>
                                {this.props.specific_position}
                            </MediaBoxDescription>
                            <MediaBoxInfo>
                                <MediaBoxInfoMeta>{this.props.district_name}</MediaBoxInfoMeta>
                                <MediaBoxInfoMeta extra >{this.props.officetime}</MediaBoxInfoMeta>
                            </MediaBoxInfo>
                        </MediaBoxBody>
                </MediaBox>
            </NavLink>
        );
    }
}

export default Locations;