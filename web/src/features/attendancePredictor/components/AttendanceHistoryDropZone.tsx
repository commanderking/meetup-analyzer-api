import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import _ from "lodash";
import Paper from "@material-ui/core/Paper";
/** @jsx jsx */
import { css, jsx } from "@emotion/core";

type Props = {
  setCanSubmit: Function;
  setRawMeetupData: Function;
};

function AttendanceHistoryDropZone({ setCanSubmit, setRawMeetupData }: Props) {
  const onDrop = useCallback(acceptedFiles => {
    setCanSubmit(true);
    const reader = new FileReader();
    reader.onabort = () => console.log("file reading was aborted");
    reader.onerror = () => console.log("file reading has failed");
    reader.onload = () => {
      // @ts-ignore - looks like no typescript for csv yet

      setRawMeetupData(reader.result);
    };

    reader.readAsBinaryString(acceptedFiles[0]);
    // acceptedFiles.forEach((file: File) => reader.readAsBinaryString(file));
  }, []);

  // @ts-ignore - do we need special types here to use the hook properly here?
  const { getRootProps, getInputProps, acceptedFiles, open } = useDropzone({
    accept: ".csv",
    multiple: false,
    onDrop
  });

  return (
    <div className="container">
      <Paper
        css={css`
           {
            padding: 20px;
          }
        `}
      >
        {acceptedFiles.length ? (
          <div>
            <div>Uploaded file: {acceptedFiles[0].name}</div>
          </div>
        ) : (
          <div
            css={css`
               {
                flex: 1;
                display: flex;
                flex-direction: column;
                align-items: center;
                padding: 20px;
                border-width: 2px;
                border-radius: 2px;
                border-color: #eeeeee;
                border-style: dashed;
                background-color: #fafafa;
                color: #bdbdbd;
                outline: none;
                transition: border 0.24s ease-in-out;
                cursor: pointer;
              }
            `}
            {...getRootProps({
              className: "dropzone"
            })}
          >
            {
              // getInputProp has refKey prop, which html input does not accept
              // which is why we're omitting "refKey" here. Not needed except in
              // certain circumstances
            }
            <input {..._.omit(getInputProps(), "refKey")} />
            <p>Drop a csv file here or click to upload file</p>
          </div>
        )}
      </Paper>
    </div>
  );
}

export default AttendanceHistoryDropZone;
