// AgBtnCellRenderer.jsx
import { Component } from 'react';
import Button from '@mui/material/Button';

export default class AgBtnCellRenderer extends Component {
  constructor(props) {
    super(props);
    this.btnClickEdit = this.btnClickEdit.bind(this);
    this.btnClickDelete = this.btnClickDelete.bind(this);
  }
  btnClickEdit() {
   this.props.editClicked(this.props.data);
  }
  btnClickDelete() {
    // console.log(this.props);
   this.props.deleteClicked(this.props.data);
  }
  render() {
    return (
      <>
        <Button onClick={this.btnClickEdit}>Edit</Button>
        <Button onClick={this.btnClickDelete}>Delete</Button>
      </>
    )
  }
}