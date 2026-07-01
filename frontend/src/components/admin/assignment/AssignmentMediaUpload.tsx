import { useRef, useState, type ChangeEvent, type DragEvent } from 'react'
import { Upload, X } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import type { AssignmentMediaFile } from '../../../types/assignment'
import { createMediaFileFromBrowserFile } from './assignmentUtils'
import styles from './AssignmentMediaUpload.module.css'

interface AssignmentMediaUploadProps {
  label: string
  icon: LucideIcon
  accept: string
  files: AssignmentMediaFile[]
  onChange: (files: AssignmentMediaFile[]) => void
}

function matchesAccept(file: File, accept: string): boolean {
  if (!accept) return true

  return accept.split(',').some((rule) => {
    const trimmed = rule.trim()
    if (!trimmed) return false
    if (trimmed.startsWith('.')) {
      return file.name.toLowerCase().endsWith(trimmed.toLowerCase())
    }
    if (trimmed.endsWith('/*')) {
      const typePrefix = trimmed.slice(0, -1)
      return file.type.startsWith(typePrefix)
    }
    return file.type === trimmed
  })
}

export function AssignmentMediaUpload({
  label,
  icon: Icon,
  accept,
  files,
  onChange,
}: AssignmentMediaUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = useState(false)

  const addFiles = (selectedFiles: File[]) => {
    const accepted = selectedFiles.filter((file) => matchesAccept(file, accept))
    if (accepted.length === 0) return

    const nextFiles = [...files, ...accepted.map(createMediaFileFromBrowserFile)]
    onChange(nextFiles)
  }

  const handleSelect = (event: ChangeEvent<HTMLInputElement>) => {
    addFiles(Array.from(event.target.files ?? []))
    event.target.value = ''
  }

  const handleRemove = (fileId: string) => {
    onChange(files.filter((file) => file.id !== fileId))
  }

  const handleDragEnter = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    setIsDragging(true)
  }

  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault()
  }

  const handleDragLeave = (event: DragEvent<HTMLDivElement>) => {
    if (event.currentTarget.contains(event.relatedTarget as Node)) return
    setIsDragging(false)
  }

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    setIsDragging(false)
    addFiles(Array.from(event.dataTransfer.files))
  }

  return (
    <div className={styles.root}>
      <div
        className={`${styles.uploadBox} ${isDragging ? styles.uploadBoxDragging : ''}`}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className={styles.uploadHeader}>
          <Icon size={18} className={styles.uploadIcon} aria-hidden="true" />
          <p className={styles.uploadLabel}>{label}</p>
        </div>
        <button
          type="button"
          className={styles.uploadBtn}
          onClick={() => inputRef.current?.click()}
        >
          <Upload size={14} />
          파일 선택
        </button>
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple
          className={styles.hiddenInput}
          onChange={handleSelect}
        />
      </div>

      {files.length > 0 && (
        <ul className={styles.fileList}>
          {files.map((file) => (
            <li key={file.id} className={styles.fileItem}>
              <div className={styles.fileInfo}>
                <Icon size={14} className={styles.fileListIcon} aria-hidden="true" />
                <span className={styles.fileName}>
                  {file.name}
                  {file.sizeLabel && (
                    <span className={styles.fileSize}> ({file.sizeLabel})</span>
                  )}
                </span>
              </div>
              <button
                type="button"
                className={styles.removeBtn}
                onClick={() => handleRemove(file.id)}
                aria-label={`${file.name} 삭제`}
              >
                <X size={16} />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
