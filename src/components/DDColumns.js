import React, { Component } from 'react'
import {ListSubheader} from '@material-ui/core';
import {Droppable} from 'react-beautiful-dnd';
import DDContent from './DDContent';
import styled from 'styled-components';

const Container = styled.div`
  transition : background-color 0.2s ease;
  background-color : ${props => {return props.isDraggingOver ? 'darkgrey' : 'white'}};
  border-radius : 3px;
  padding : 3px;
  min-height:50px;
`;


export class DDColumn extends Component {
  render() {
    return (
      <div>
        <ListSubheader inset>{this.props.column.title}</ListSubheader>
        <Droppable droppableId={this.props.column.id} type={this.props.droppableType}>
        {(provided, snapshot) => {
         return (<Container 
        ref = {provided.innerRef}
        innerRef = {provided.innerRef}
        {...provided.droppableProps}
        isDraggingOver = {snapshot.isDraggingOver}
        >
            {this.props.elements.map((element, index) => {
                return (
                    <DDContent key={element.id} element={element} index={index} />
                )
            })}
            {provided.placeholder}
        </Container>)
        }}
        
        </Droppable>
      </div>
    )
  }
}

export default DDColumn
