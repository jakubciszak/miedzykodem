import './Aurora.css';

export default function Aurora({ variant = 'full' }) {
  if (variant === 'subtle') {
    return (
      <div className="aurora">
        <div className="aurora-blob aurora-blob--subtle-1" />
        <div className="aurora-blob aurora-blob--subtle-2" />
        <div className="aurora-blob aurora-blob--subtle-3" />
      </div>
    );
  }

  return (
    <div className="aurora" id="aurora">
      <div className="aurora-blob aurora-blob--1" id="auroraBlob1" />
      <div className="aurora-blob aurora-blob--2" id="auroraBlob2" />
      <div className="aurora-blob aurora-blob--3" id="auroraBlob3" />
      <div className="aurora-blob aurora-blob--4" id="auroraBlob4" />
      <div className="aurora-blob aurora-blob--5" id="auroraBlob5" />
    </div>
  );
}
