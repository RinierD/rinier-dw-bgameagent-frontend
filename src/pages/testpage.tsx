import React, { useState } from 'react';

export const TestPage = () => {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <div>test is the testpage</div>
      <div></div>
      <div className='panelContainer'>
        <h2>Basic Panel</h2>
        <div className='panel panel-default'>
          <div className='panel-heading'>Board</div>
          <div className='panel-body'>A Basic Panel</div>
          <div className='panel-footer'>A Basic Panel footer</div>
        </div>
      </div>
    </div>
  );
};
