
import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  LayoutAnimation,
  UIManager,
  BackAndroid,
} from 'react-native';


var CustomLayoutLinear = {
  duration: 100,
  create: {
    type: LayoutAnimation.Types.linear,
    property: LayoutAnimation.Properties.scaleXY,
  },
  update: {
    type: LayoutAnimation.Types.curveEaseInEaseOut,
  },
};

UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);


class Router extends Component{

  static contextTypes = { store: React.PropTypes.object.isRequired };

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


  getNavBarOpts( route ){
    if( route.toolBarOpts ){
      return route.toolBarOpts;
    }

    let opts = {
      title: route.title,
      titleColor: 'white',
      navIconName: 'md-arrow-back',
      overflowIconName: 'md-more',
      onIconClicked: this.handleIconClick,
    };
    if( route.onTitleSelect ){
      opts.onActionSelected = route.onTitleSelect;
    }

    return opts;
  }


  handleIconClick(){
    if( this.context.store.getState().router.routes.length === 1 ){
      return BackAndroid.exitApp();
    }

    return this.context.store.dispatch({
      type: 'ROUTER_POP',
      payload:{}
    });
  }


  componentWillUpdate() {
    LayoutAnimation.configureNext( CustomLayoutLinear );
  }

  componentDidMount(){
    this.context.store.dispatch({
      type: 'ROUTER_PUSH',
      payload: {
        name: this.initial.name
      }
    });
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
      <View style={ styles.toolbarWrapper } >
      </View>
      <View style={styles.component} >
        <route.component  {...routeData.params} routerData={routeData.params} />
      </View>
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
    case 'ROUTER_POP':
      stack.pop();
      break;
  }
  return {
    ...state,
    routes: stack,
  };
}


class Schema extends Component{ }
class Route extends Component{ }
class TabRoute extends Component{ }


let styles = StyleSheet.create({
  toolbar: {
    backgroundColor: '#08dd50',
    height: 56,
  },
  toolbarWrapper:{
    height: 56,
    borderColor: '#880000', borderStyle: 'solid', borderWidth: 2,
  },
  component: {
    flex: 50,
    borderColor: '#888800', borderStyle: 'solid', borderWidth: 2,
  },
  container: {
    flex: 1,
    borderColor: '#880088', borderStyle: 'solid', borderWidth: 2,
  }
});


module.exports = { Route, TabRoute, Router, Schema, reducer }
