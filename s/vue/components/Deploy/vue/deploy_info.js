export default {
  name: 'DeployInfo',
  data() {
    return {
      info: null
    }
  },
  computed: {
    text() {
      if (!this.info) return ''
      const env = this.info.environment || ''
      const shortSha = (this.info.commit || '').substring(0, 7)
      const deployedAt = this.info.deployedAt ? new Date(this.info.deployedAt).toLocaleString() : ''
      
      // For main environment, show only the deployedAt date/time
      if (env === 'main') {
        return 'Updated ' + deployedAt || ''
      }
      
      const parts = [
        this.info.branch ? `branch: ${this.info.branch}` : null,
        shortSha ? `commit: ${shortSha}` : null,
        deployedAt ? `deployed: ${deployedAt}` : null,
        this.info.environment ? `env: ${this.info.environment}` : null,
        this.info.actor ? `by: ${this.info.actor}` : null
      ].filter(Boolean)
      return parts.length ? `Updated · ${parts.join(' · ')}` : ''
    }
  },
  mounted() {
    // Skip fetching in local dev to avoid 404 noise
    const isLocal =
      window.location.hostname === 'localhost' ||
      window.location.hostname === '127.0.0.1'
    if (isLocal) return

    const url = '../deploy-info.json'
    fetch(url, { cache: 'no-store' })
      .then(res => {
        if (!res.ok) throw new Error('no deploy info')
        return res.json()
      })
      .then(json => {
        this.info = json
      })
      .catch(() => {
        // no deploy info available (local dev), keep hidden
      })
  },
  template: `
    <div v-if="text" id="deployInfoFooter">
      {{ text }}
    </div>
  `
}

