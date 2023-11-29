import { NodeViewWrapper, NodeViewWrapperProps } from '@tiptap/react'
import { useCallback, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { v4 as uuid } from 'uuid'
import { ImageOptions } from '@tiptap-pro/extension-ai'

import * as PopoverMenu from '@/components/ui/PopoverMenu'
import { Button } from '@/components/ui/Button'
import { Loader } from '@/components/ui/Loader'
import { Panel, PanelHeadline } from '@/components/ui/Panel'
import { Textarea } from '@/components/ui/Textarea'
import { Icon } from '@/components/ui/Icon'

const imageStyles = [
  { name: 'photorealistic', label: 'Photorealistic', value: 'photorealistic' },
  { name: 'digital-art', label: 'Digital art', value: 'digital_art' },
  { name: 'comic-book', label: 'Comic book', value: 'comic_book' },
  { name: 'neon-punk', label: 'Neon punk', value: 'neon_punk' },
  { name: 'isometric', label: 'Isometric', value: 'isometric' },
  { name: 'line-art', label: 'Line art', value: 'line_art' },
  { name: '3d-model', label: '3D model', value: '3d_model' },
]

interface Data {
  text: string
  imageStyle?: ImageOptions
}

export const AiImageView = ({ editor, node, getPos, deleteNode }: NodeViewWrapperProps) => {
  const [data, setData] = useState<Data>({
    text: '',
    imageStyle: undefined,
  })
  const currentImageStyle = imageStyles.find(t => t.value === data.imageStyle)
  const [previewImage, setPreviewImage] = useState<string | undefined>(undefined)
  const [isFetching, setIsFetching] = useState(false)
  const textareaId = useMemo(() => uuid(), [])

  const generateImage = useCallback(async () => {
    if (!data.text) {
      toast.error('Please enter a description for the image')

      return
    }

    setIsFetching(true)

    const payload = {
      text: data.text,
      style: data.imageStyle,
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_TIPTAP_AI_BASE_URL}/image/prompt` || '', {
        method: 'POST',
        headers: {
          accept: 'application.json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      const json = await response.json()
      const url = json.response

      if (!url.length) {
        return
      }

      setPreviewImage(url)

      setIsFetching(false)
    } catch (errPayload: any) {
      const errorMessage = errPayload?.response?.data?.error
      const message = errorMessage !== 'An error occurred' ? `An error has occured: ${errorMessage}` : errorMessage

      setIsFetching(false)
      toast.error(message)
    }
  }, [data])

  const insert = useCallback(() => {
    if (!previewImage?.length) {
      return
    }

    editor
      .chain()
      .insertContent(`<img src="${previewImage}" alt="" />`)
      .deleteRange({ from: getPos(), to: getPos() })
      .focus()
      .run()

    setIsFetching(false)
  }, [editor, previewImage, getPos])

  const discard = useCallback(() => {
    deleteNode()
  }, [deleteNode])

  const handleTextareaChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => setData(prevData => ({ ...prevData, text: e.target.value })),
    [],
  )

  const onUndoClick = useCallback(() => {
    setData(prevData => ({ ...prevData, imageStyle: undefined }))
    setPreviewImage(undefined)
  }, [])

  const createItemClickHandler = useCallback((style: { name: string; label: string; value: string }) => {
    return () => setData(prevData => ({ ...prevData, imageStyle: style.value as ImageOptions }))
  }, [])

  return (
    <NodeViewWrapper data-drag-handle>
      <Panel noShadow className="w-full bg-card-background text-card-foreground">
        <div className="flex flex-col p-1">
          {isFetching && <Loader label="AI is now doing its job!" />}
          {previewImage && (
            <>
              <PanelHeadline>Preview</PanelHeadline>
              <div
                className="w-full mb-4 bg-white bg-center bg-no-repeat bg-contain border border-black rounded aspect-square"
                style={{ backgroundImage: `url(${previewImage})` }}
              />
            </>
          )}
          <div className="flex items-center justify-between gap-2 row">
            <PanelHeadline asChild>
              <label htmlFor={textareaId}>Prompt</label>
            </PanelHeadline>
          </div>
          <Textarea
            id={textareaId}
            value={data.text}
            onChange={handleTextareaChange}
            placeholder={`Describe the image that you want me to generate.`}
            required
            className="mb-2"
          />
          <div className="flex flex-row items-center justify-between gap-1">
            <div className="flex justify-between w-auto gap-1">
              <PopoverMenu.Menu
                withPortal
                customTrigger
                trigger={
                  <Button variant="quaternary">
                    <Icon name="Image" />
                    {currentImageStyle?.label || 'Image style'}
                    <Icon name="ChevronDown" />
                  </Button>
                }
              >
                {!!data.imageStyle && (
                  <>
                    <PopoverMenu.Item
                      label="Reset"
                      icon="Undo2"
                      isActive={data.imageStyle === undefined}
                      onClick={onUndoClick}
                    />
                    <PopoverMenu.Divider />
                  </>
                )}
                {imageStyles.map(style => (
                  <PopoverMenu.Item
                    isActive={style.value === data.imageStyle}
                    key={style.value}
                    label={style.label}
                    onClick={createItemClickHandler(style)}
                  />
                ))}
              </PopoverMenu.Menu>
            </div>
            <div className="flex flex-row items-center justify-between gap-1">
              {previewImage && (
                <Button
                  variant="ghost"
                  className="text-red-500 hover:bg-red-500/10 hover:text-red-500"
                  onClick={discard}
                >
                  <Icon name="Trash" />
                  Discard
                </Button>
              )}
              {previewImage && (
                <Button variant="ghost" onClick={insert}>
                  <Icon name="Check" />
                  Insert
                </Button>
              )}
              <Button variant="primary" onClick={generateImage}>
                {previewImage ? <Icon name="Repeat" /> : <Icon name="Sparkles" />}
                {previewImage ? 'Regenerate' : 'Generate image'}
              </Button>
            </div>
          </div>
        </div>
      </Panel>
    </NodeViewWrapper>
  )
}