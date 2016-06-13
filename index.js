
import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  LayoutAnimation,
  UIManager,
  BackAndroid,
} from 'react-native';

import NavBar from './NavBar';


var CustomLayoutLinear = {
  duration: 200,
  create: {
    type: LayoutAnimation.Types.linear,
    property: LayoutAnimation.Properties.scaleXY,
  },
  update: {
    type: LayoutAnimation.Types.linear,
    property: LayoutAnimation.Properties.scaleXY,
  },
};

UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);


class Router extends Component{

  static contextTypes = { store: React.PropTypes.object.isRequired };

  static goto( store, name, params={} ){
    store.dispatch({
      type: 'ROUTER_PUSH',
      payload: {
        name: name,
        data: params
      }
    });
  }

  static goBack( store ){
    return store.dispatch({
      type: 'ROUTER_POP',
      payload:{}
    });
  }

  constructor( props ){
    super();
    this.routes = this.parseRoutes( props.children );
    this.initial = this.routes[ props.initial ];
    this.handleIconClick = this.handleIconClick.bind(this);
  }

  parseRoutes( children, storage = {} ){
    React.Children.forEach( children, ( child ) =>{
      console.log( child.type );
      let childType = child.type.prototype.constructor.name;
      switch( childType ){
        case 'TabRoute':
          this.parseRoutes( child.props.children, storage );
          break;
        case 'Route':
          storage[child.props.name] = child.props;
          break;
        default:
          console.log( 'Invalid type of element passed to routes ', childType );
          break;
      }
    });
    return storage;
  }


  handleIconClick(){
    if( this.context.store.getState().router.routes.length === 1 ){
      return BackAndroid.exitApp();
    }
    Router.goBack( this.context.store );
  }


  componentWillUpdate() {
    LayoutAnimation.configureNext( CustomLayoutLinear );
  }

  componentDidMount(){
    Router.goto( this.context.store, this.initial.name );
  }


  getNavBarOpts( route ){
    let opts = {
      title: route.title,
      onNavLeftPress: this.handleIconClick,
      navLeft: route.navLeft,
    };
    return opts;
  }

  renderNavbar( route ){
    let navBarOpts = this.getNavBarOpts( route );
    if( !route.hideNavBar ){
      return <NavBar {...navBarOpts} />;
    }
  }

  render(){
    var store = this.context.store.getState();
    let routes = store.router.routes;

    if( !routes.length ){
      return <Text>Loading..</Text>;
    }

    let routeData = routes[ routes.length -1 ];
    let route = this.routes[ routeData.name ];
    return (
    <View style={styles.container}>
      {this.renderNavbar( route )}
      <route.component  {...routeData.params} routerData={routeData.params} />
    </View>
    );
  }
}

const initialRouteState = {
  routes: [],
}


function reducer( state = initialRouteState, action ){
  let stack = state.routes.slice();

  switch( action.type ){

    case 'ROUTER_PUSH':
      stack.push( {
        name: action.payload.name,
        params: action.payload.data || {},
      });
      break;
    case 'ROUTER_REPLACE':
      stack.pop();
      stack.push({
        name: action.payload.name,
        params: action.payload.data || {},
      });
      break;
    case 'ROUTER_POP':
      stack.pop();
      break;
  }
  return {
    currentRoute: stack.length? stack[ stack.length -1 ].name : undefined,
    routes: stack,
  };
}


class Schema extends Component{ }
class Route extends Component{ }
class TabRoute extends Component{ }


let styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    flex: 1,
    alignSelf: 'stretch',
    // borderColor: '#880088', borderStyle: 'solid', borderWidth: 2, backgroundColor: '#ff0000',
  }
});


module.exports = { Route, TabRoute, Router, Schema, reducer }
