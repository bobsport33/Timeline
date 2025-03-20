# EOD Timeline

This timeline is a React component that will live in a NextJS application. The NextJS application runs on React 19.0.0. The timeline component will be able to display a large variety of content on a timeline that is interactable. The changes in the timeline will need to call functions that update content on the site.

## Initial Requirements

1. Drag and drop each row.
2. Change study parameters from study design figure.
   i.e., can we change the study period by shrinking the row within the diagram. To interconnect it with rest of front end.
3. Customize colors for each bar.
4. Customize both physical text and font selection.
5. Allow for export to PowerPoint.
6. Hover tool tips, customize what they say.
7. Auto sizing.
8. Should be able to delete and/or hide rows.
   If delete, then remove parameter selection from actual cohort build.
9. Allow users to zoom and scroll.
10. Study design hover over on each tab (nice to have)
    a. Would live as a pop up on each tab of go/eod

## Latest Feedback

1. Ideally would be able to reorder bars by dragging and dropping up and down instead of through the ledgend.
    - Ledgend placement will probably need to move as well
2. If zoomed in very far, would like to see month as well as year. Somehow create an updating x-axis that will show year when zoomed out and month when zoomed in to a certain point.
3. Create two button
    - Max Zoom Out: Zoom out to view the whole timeline
    - Download: Export current visualization to image and download it to the users computer.
4. When viewing year, drag and drop should snap to year. May need to adjust to month when zoomed in
5. Add a delete button into the right click menu to delete a row.

## Current bugs/changes needed

-   Zoom out does not allow to zoom out or scroll past the lowest or highest date.
-   Date objects were having odd behavior, so built out x-axis using the year. Will need to convert back to date objects and figure out the issues.
-   Drag and drop console logs for the year is not always accurate. Think this is an issue with the rounding.
