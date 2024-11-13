import { UploadFile } from '@mui/icons-material';
import { FormControl, FormHelperText, Typography } from '@mui/material';
import {useCallback} from 'react'
import {useDropzone} from 'react-dropzone'
import { useController, UseControllerProps } from 'react-hook-form'

interface Props extends UseControllerProps {}

export default function AppDropzone(props: Props) {
    const {fieldState, field} = useController({...props, defaultValue: null});

    const dropzoneStyles = {
        display: 'flex',
        border: 'dashed 3px #eee',
        borderColor: '#eee',
        borderRadius: '5px',
        paddingTop: '30px',
        alignItems: 'center',
        width: 500,
        height: 200
    }

    const dropzoneActive = {
        borderColor: '#006400'
    }

    const onDrop = useCallback((acceptedFiles: any) => {
    acceptedFiles[0] = Object.assign(acceptedFiles[0], 
        {preview: URL.createObjectURL(acceptedFiles[0])});
    field.onChange(acceptedFiles[0]);
  }, [field])
  const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop})

  return (
    <div {...getRootProps()}>
      <FormControl style={isDragActive ? {...dropzoneStyles, ...dropzoneActive} : dropzoneStyles} error={!!fieldState.error}>
        <input {...getInputProps()} />
        <UploadFile sx={{fontSize: '100px'}} />
        <Typography variant='h4'>Drop image here</Typography>
        <FormHelperText>{fieldState.error?.message}</FormHelperText>
      </FormControl>
    </div>
  )
}