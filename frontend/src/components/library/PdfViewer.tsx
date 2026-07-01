import { FileText, Download, Eye } from 'lucide-react'
import { Card } from '../ui/Card'
import type { MaterialFile } from '../../data/mockLibraryData'
import styles from './PdfViewer.module.css'

interface PdfViewerProps {
  file: MaterialFile
}

export function PdfViewer({ file }: PdfViewerProps) {
  return (
    <Card className={styles.viewer} padding="md">
      <div className={styles.preview} role="img" aria-label="PDF 미리보기">
        <div className={styles.page}>
          <div className={styles.pageHeader}>
            <FileText size={20} className={styles.pageIcon} />
            <span>PDF Preview</span>
          </div>
          <div className={styles.lines}>
            <span />
            <span />
            <span />
            <span />
            <span />
            <span />
          </div>
        </div>
      </div>

      <div className={styles.info}>
        <div className={styles.fileMeta}>
          <FileText size={18} className={styles.pdfIcon} />
          <div>
            <p className={styles.fileName}>{file.name}</p>
            <p className={styles.fileSize}>PDF · {file.size}</p>
          </div>
        </div>
        <div className={styles.actions}>
          <button type="button" className={styles.viewBtn}>
            <Eye size={16} />
            PDF 보기
          </button>
          <button type="button" className={styles.downloadBtn} aria-label="PDF 다운로드">
            <Download size={16} />
          </button>
        </div>
      </div>
    </Card>
  )
}
