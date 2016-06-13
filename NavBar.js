import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import Icon from 'react-native-vector-icons/MaterialIcons';


/**
 * NavBar
 *
 * NavBar component
 * Can have any no of childrens also
 *
 * @param {Style} style - Style of container View Component
 * @param {Component} titleComponent - Title Component
 * @param {String} title - Title String
 * @param {Object} titleParams - Params passed to title Text Component
 * @param {Component} navLeft - NavLeft Component
 * @param {Object} navLeftIcon - eg: { name: 'chevron-back', size:30, color: '#FFFFFF' } passed to Icon Component of 'react-native-vector-icons/MaterialIcons'
 * @param {Function} onNavLeftPress - Handler for Navleft press.
 * @returns {undefined}
 */
export default class NavBar extends Component {

  renderTitle(){
    let props = this.props;
    if( props.titleComponent ){
      return props.titleComponent;
    }
    return (
      <Text style={styles.navTitle} containerStyle={ styles.titleContainer} {...props.titleParams} >{ props.title }</Text>
    )
  }

  renderLeftSide(){
    let props = this.props;
    if( props.navLeft ){ return props.navLeft; }
    if( props.navLeftIcon ){
      return (
        <Icon {...props.navLeftIcon} />
      )
    }
    return ( <Icon onPress={props.onNavLeftPress} name="navigate-before" size={45} color="#FFFFFF" style={styles.navLeft} /> )
  }

  renderBody(){
    return [
      this.renderLeftSide(),
      this.renderTitle(),
      ...(this.props.children || [])
    ].map((v, i) => { return <View key={'rnsrr-navbarItem-' + i} style={[styles.item, v.props.containerStyle]} >{v}</View>  });
  }

  render(){
    let props = this.props;

    return (
      <View style={ [ styles.navBar, props.style ] }>
        {this.renderBody()}
      </View>
      );
  }

}

const styles = StyleSheet.create({
  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignSelf: 'stretch',
    alignItems: 'center',
    backgroundColor: '#ED1C26',
    height: 48,
  },
  navTitle: {
    color: '#FFFFFF',
    fontWeight: '500',
    fontSize: 17,
    alignSelf: 'center',
  },
  titleContainer:{
    // borderStyle: 'solid', borderWidth: 2, borderColor: '#009900',
    alignSelf: 'stretch',
    flexDirection: 'column',
    justifyContent: 'center',
    flex: 1,
  },
  item:{
    padding: 2,
    alignSelf: 'center',
  }
});
