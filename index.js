
import React, { Component } from 'react';
import {
  Text,
  View,
  LayoutAnimation,
  UIManager
} from 'react-native';


UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);


export function Route( ){ return <Text>This is Route</Text>; }


export class Router extends Component{

  static contextTypes = { store: React.PropTypes.object.isRequired };

  constructor( props ){
    super();
    let routeData = {};
    React.Children.forEach( props.children, ( child ) =>{
      let { name, component } = child.props;
      let route = {
        component: component,
        name: name,
      };
      routeData[name] = route;
    });
    this.routeData = routeData;
    this.initial = routeData[ props.initial ];
  }

  componentWillUpdate() {
    LayoutAnimation.configureNext( LayoutAnimation.Presets.spring );
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

    LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);

    if( !routes.length ){
      return <Text>Loading..</Text>;
    }

    let routeName = routes[ routes.length -1 ];
    let route = this.routeData[ routeName ];
    return <route.component />;
  }
}


const initialRouteState = {
  routes: [],
}


export  function reducer( state = initialRouteState, action ){
  let stack = state.routes.slice();

  switch( action.type ){

    case 'ROUTER_PUSH':
      stack.push( action.payload.name );
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


export function Schema(){ return <View></View>; }




