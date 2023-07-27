// AgBtnCellRenderer.jsx
import React from 'react';
import Button from '@mui/material/Button';

export type AgBtnCellProps = {
  editClicked: (s: string) => void,
  deleteClicked: (s: string) => void,
  id: string
}

type AgBtnCellState = {

}

export default class AgBtnCellRenderer extends React.Component<AgBtnCellProps, AgBtnCellState> {
  constructor(props: AgBtnCellProps) {
    super(props);
    this.btnClickEdit = this.btnClickEdit.bind(this);
    this.btnClickDelete = this.btnClickDelete.bind(this);
  }
  btnClickEdit() {
   this.props.editClicked(this.props.id);
  }
  btnClickDelete() {
   this.props.deleteClicked(this.props.id);
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