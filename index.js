
import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  LayoutAnimation,
  UIManager,
  BackAndroid,
} from 'react-native';

import Icon from 'react-native-vector-icons/Ionicons';


console.log( LayoutAnimation.Properties, LayoutAnimation.Types );
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

export function Route( ){ return <Text>This is Route</Text>; }



export class Router extends Component{

  static contextTypes = { store: React.PropTypes.object.isRequired };

  constructor( props ){
    super();
    let routeData = {};
    React.Children.forEach( props.children, ( child ) =>{
      let { name, component, title, toolBarOpts } = child.props;
      let route = {
        component: component,
        name: name,
        title: title || '',
        toolBarOpts: toolBarOpts,
      };
      routeData[name] = route;
    });
    this.routeData = routeData;
    this.initial = routeData[ props.initial ];
    this.handleIconClick = this.handleIconClick.bind(this);
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
    let route = this.routeData[ routeData.name ];
    return (
    <View style={styles.container}>
      <View style={ styles.toolbarWrapper } >
        <Icon.ToolbarAndroid style={styles.toolbar} {...this.getNavBarOpts( route )} />
      </View>
      <View style={styles.component} >
        <route.component  {...route.params} />
      </View>
    </View>
    );
  }
}


const initialRouteState = {
  routes: [],
}


export  function reducer( state = initialRouteState, action ){
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


export function Schema(){ return <View></View>; }


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


