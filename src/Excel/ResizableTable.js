import React, { useState } from 'react';

const Table = () => {
  const [columnWidths, setColumnWidths] = useState([200, 200, 200]); // Initial widths

  const handleMouseDown = (index, event) => {
    document.body.style.curor='col-resize';
    const startX = event.clientX;
    const startWidth = columnWidths[index];

    const onMouseMove = (event) => {
      const newWidths = [...columnWidths];
      newWidths[index] = Math.max(startWidth + event.clientX - startX, 50); // Ensure a minimum width
      setColumnWidths(newWidths);
    };

    const onMouseUp = () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      document.body.style.cursor = "";
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  };

  return (
    <table>
      <thead>
        <tr>
          {columnWidths.map((width, index) => (
            <th key={index} style={{ width: width }}>
              Column {index + 1}
              <div
                style={{
                  display: 'inline-block',
                  width: '5px',
                  cursor: 'col-resize',
                  position: 'absolute',
                  right: 0,
                  top: 0,
                  bottom: 0,
                }}
                onMouseDown={(event) => handleMouseDown(index, event)}
              />
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        <tr>
          <td style={{ width: columnWidths[0], wordBreak: 'break-word' }}>
            SuperLongWordWithoutSpacesThatNeedsToBeCutOffAtSomePoint
          </td>
          <td style={{ width: columnWidths[1], wordBreak: 'break-word' }}>
            AnotherSuperLongWordThatShouldBeCutOffOrWrapped
          </td>
          <td style={{ width: columnWidths[2], wordBreak: 'break-word' }}>
            YetAnotherLongWordInTheTable
          </td>
        </tr>
      </tbody>
    </table>
  );
};

export default Table;
