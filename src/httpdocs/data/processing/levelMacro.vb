Sub Level()
    'where values start
    beginrow = 2
    'where values end
    Range("A1").End(xlDown).Select
    endrow = ActiveCell.Row
    'first empty colum
    Range("A1").End(xlToRight).Offset(0, 1).Select
    levelcol = ActiveCell.Column
    ActiveCell.Value = "LEVEL"
    'write nesting level
    For i = beginrow To endrow
        Cells(i, levelcol) = Rows(i).OutlineLevel() - 1
    Next
End Sub
    
