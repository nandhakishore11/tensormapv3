import React, { Component } from 'react'
import { ListItem } from '@material-ui/core';
import {Draggable} from 'react-beautiful-dnd';
import styled from 'styled-components';

const Container = styled.div`
  transition: background-color 0.2s ease;
  background-color : ${props => {return (props.isDragging ? 'lightgrey' : 'white');}};
  border-radius : 3px;
  margin : 3px;
`;

export class DDContent extends Component {
  render() {
      const {classes} = this.props;
    return (
        <Draggable draggableId={this.props.element.id} index={this.props.index}>
        {(provided, snapshot) => {
            return (
            <Container
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            ref = {provided.innerRef}
            isDragging = {snapshot.isDragging}
            >
            <ListItem button>
            {this.props.element.content}
            </ListItem>
            </Container>)
        }}
        
        </Draggable>
    )
  }
}

export default DDContent;
