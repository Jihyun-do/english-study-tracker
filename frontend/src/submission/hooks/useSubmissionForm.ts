import { useState, useCallback } from 'react'
import type { SubmissionImageTheme } from '../submissionUtils'
import type { SubmissionFormData } from '../types'

const INITIAL_FORM: Omit<SubmissionFormData, 'assignmentId'> = {
  imageFile: null,
  imagePreviewUrl: null,
  audioFile: null,
  memo: '',
}

export interface SubmissionFormInitialValues {
  memo?: string
  existingImageTheme?: SubmissionImageTheme | null
  existingAudioFileName?: string | null
}

export function useSubmissionForm(assignmentId: string, initialValues?: SubmissionFormInitialValues) {
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null)
  const [existingImageTheme, setExistingImageTheme] = useState<SubmissionImageTheme | null>(
    initialValues?.existingImageTheme ?? null,
  )
  const [audioFile, setAudioFile] = useState<File | null>(null)
  const [existingAudioFileName, setExistingAudioFileName] = useState<string | null>(
    initialValues?.existingAudioFileName ?? null,
  )
  const [memo, setMemo] = useState(initialValues?.memo ?? '')

  const handleImageSelect = useCallback((file: File, previewUrl: string) => {
    if (imagePreviewUrl) URL.revokeObjectURL(imagePreviewUrl)
    setImageFile(file)
    setImagePreviewUrl(previewUrl)
    setExistingImageTheme(null)
  }, [imagePreviewUrl])

  const handleImageClear = useCallback(() => {
    if (imagePreviewUrl) URL.revokeObjectURL(imagePreviewUrl)
    setImageFile(null)
    setImagePreviewUrl(null)
    setExistingImageTheme(null)
  }, [imagePreviewUrl])

  const handleAudioSelect = useCallback((file: File) => {
    setAudioFile(file)
    setExistingAudioFileName(null)
  }, [])

  const handleAudioClear = useCallback(() => {
    setAudioFile(null)
    setExistingAudioFileName(null)
  }, [])

  const getFormData = useCallback((): SubmissionFormData => ({
    assignmentId,
    imageFile,
    imagePreviewUrl,
    audioFile,
    memo,
  }), [assignmentId, imageFile, imagePreviewUrl, audioFile, memo])

  const reset = useCallback(() => {
    if (imagePreviewUrl) URL.revokeObjectURL(imagePreviewUrl)
    setImageFile(INITIAL_FORM.imageFile)
    setImagePreviewUrl(INITIAL_FORM.imagePreviewUrl)
    setExistingImageTheme(initialValues?.existingImageTheme ?? null)
    setAudioFile(INITIAL_FORM.audioFile)
    setExistingAudioFileName(initialValues?.existingAudioFileName ?? null)
    setMemo(initialValues?.memo ?? '')
  }, [imagePreviewUrl, initialValues])

  const displayAudioFileName = audioFile?.name ?? existingAudioFileName

  return {
    imagePreviewUrl,
    existingImageTheme,
    audioFileName: displayAudioFileName,
    memo,
    setMemo,
    handleImageSelect,
    handleImageClear,
    handleAudioSelect,
    handleAudioClear,
    getFormData,
    reset,
  }
}
