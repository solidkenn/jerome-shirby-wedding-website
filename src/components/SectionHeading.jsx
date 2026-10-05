import Ornament from './Ornament.jsx'
import './SectionHeading.css'

export default function SectionHeading({ eyebrow, title, lead, tone = 'dark', align = 'center' }) {
  return (
    <div className={`section-heading section-heading--${align}`}>
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <h2 className="section-heading__title">{title}</h2>
      <Ornament tone={tone} className="section-heading__ornament" />
      {lead && <p className="lead section-heading__lead">{lead}</p>}
    </div>
  )
}
