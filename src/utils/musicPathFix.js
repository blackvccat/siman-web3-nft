/**
 * 音乐文件路径修复工具
 * 解决夜晚模式音乐文件名编码问题
 */

// 音乐文件映射
const MUSIC_FILES = {
  day: {
    name: 'day-theme.mp3',
    original: '狐の工作室 - おいでませ地獄街道.mp3'
  },
  night: {
    name: 'night-theme.mp3', 
    original: '上海アリス幻樂団,黄昏フロンティア - 旧地獄街道を行く.mp3'
  }
}

// 获取安全的音乐文件路径
export const getSafeMusicPath = (track) => {
  const fileInfo = MUSIC_FILES[track]
  if (!fileInfo) return ''
  
  // 优先使用简化文件名
  return `/music/${fileInfo.name}`
}

// 获取原始音乐文件路径（带编码）
export const getOriginalMusicPath = (track) => {
  const fileInfo = MUSIC_FILES[track]
  if (!fileInfo) return ''
  
  return `/music/${encodeURIComponent(fileInfo.original)}`
}

// 检查音乐文件是否存在
export const checkMusicFileExists = async (track) => {
  const safePath = getSafeMusicPath(track)
  const originalPath = getOriginalMusicPath(track)
  
  console.log(`检查音乐文件 ${track}:`)
  console.log('- 简化路径:', safePath)
  console.log('- 原始路径:', originalPath)
  
  try {
    // 先尝试简化路径
    const safeResponse = await fetch(safePath, { method: 'HEAD' })
    if (safeResponse.ok) {
      console.log('✅ 简化路径可访问')
      return safePath
    }
  } catch (error) {
    console.log('❌ 简化路径不可访问:', error.message)
  }
  
  try {
    // 再尝试原始路径
    const originalResponse = await fetch(originalPath, { method: 'HEAD' })
    if (originalResponse.ok) {
      console.log('✅ 原始路径可访问')
      return originalPath
    }
  } catch (error) {
    console.log('❌ 原始路径不可访问:', error.message)
  }
  
  console.log('❌ 所有路径都不可访问')
  return null
}

// 重命名音乐文件为简化名称
export const renameMusicFiles = () => {
  console.log('🔄 重命名音乐文件为简化名称...')
  
  const commands = [
    `copy "public\\music\\狐の工作室 - おいでませ地獄街道.mp3" "public\\music\\day-theme.mp3"`,
    `copy "public\\music\\上海アリス幻樂団,黄昏フロンティア - 旧地獄街道を行く.mp3" "public\\music\\night-theme.mp3"`
  ]
  
  console.log('需要执行的命令:')
  commands.forEach(cmd => console.log(cmd))
  
  return commands
}

// 在控制台中暴露工具函数
if (typeof window !== 'undefined') {
  window.musicPathFix = {
    getSafePath: getSafeMusicPath,
    getOriginalPath: getOriginalMusicPath,
    checkExists: checkMusicFileExists,
    renameFiles: renameMusicFiles
  }
  
  console.log('🎵 音乐文件路径修复工具已加载！')
  console.log('使用方法:')
  console.log('- musicPathFix.getSafePath("night") - 获取夜晚模式音乐简化路径')
  console.log('- musicPathFix.checkExists("night") - 检查夜晚模式音乐文件是否存在')
  console.log('- musicPathFix.renameFiles() - 显示重命名命令')
}

export default {
  getSafeMusicPath,
  getOriginalMusicPath,
  checkMusicFileExists,
  renameMusicFiles
}

